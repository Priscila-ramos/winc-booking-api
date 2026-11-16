import express from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import "dotenv/config";
import createReviewRouter from "./routes/reviews.js";
import createUserRouter from "./routes/users.js";
import createHostRouter from "./routes/hosts.js";
import createPropertyRouter from "./routes/properties.js";
import createBookingRouter from "./routes/bookings.js";
import * as Sentry from "@sentry/node";


const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.use((req, res, next) => {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const duration = Number(
      process.hrtime.bigint() - start
    ) / 1_000_000;

    console.log(
      `${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration.toFixed(2)} ms`
    );
  });

  next();
});



app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body ?? {};

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user || user.password !== password) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.AUTH_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({
      message: "Error while logging in"
    });
  }
});


const authenticate = (req, res, next) => {
  if (!["POST", "PUT", "DELETE"].includes(req.method)) {
    return next();
  }

  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: "Authentication token not provided"
    });
  }

 
const token = authorization.startsWith("Bearer ")
  ? authorization.slice(7)
  : authorization;


  try {
    req.user = jwt.verify(
      token,
      process.env.AUTH_SECRET_KEY
    );

    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

app.use(authenticate);


const validateReview = (req, res, next) => {
  if (
    !["POST", "PUT"].includes(req.method) ||
    !req.path.startsWith("/reviews")
  ) {
    return next();
  }

  const { userId, propertyId, rating, comment } = req.body ?? {};

  if (req.method === "POST") {
    if (
      typeof userId !== "string" ||
      !userId.trim() ||
      typeof propertyId !== "string" ||
      !propertyId.trim() ||
      typeof comment !== "string" ||
      !comment.trim() ||
      !Number.isInteger(rating)
    ) {
      return res.status(400).json({
        message: "Required evaluation data are invalid or missing"
      });
    }
  }

  if (req.method === "PUT") {
    if (
      !req.body ||
      typeof req.body !== "object" ||
      Array.isArray(req.body) ||
      Object.keys(req.body).length === 0
    ) {
      return res.status(400).json({
        message: "Provide the details to update the assessment"
      });
    }
  }

  if (
    rating !== undefined &&
    (!Number.isInteger(rating) || rating < 1 || rating > 5)
  ) {
    return res.status(400).json({
      message: "The rating must be an integer from 1 to 5"
    });
  }

  next();
};

app.use(validateReview);


const validationRules = {
  users: {
    username: "string",
    password: "string",
    name: "string",
    email: "string",
    phoneNumber: "string",
    pictureUrl: "string"
  },

  hosts: {
    username: "string",
    password: "string",
    name: "string",
    email: "string",
    phoneNumber: "string",
    pictureUrl: "string",
    aboutMe: "string"
  },

  properties: {
    title: "string",
    description: "string",
    location: "string",
    pricePerNight: "number",
    bedroomCount: "integer",
    bathRoomCount: "integer",
    maxGuestCount: "integer",
    hostId: "string",
    rating: "number"
  },

  bookings: {
    userId: "string",
    propertyId: "string",
    checkinDate: "date",
    checkoutDate: "date",
    numberOfGuests: "integer",
    totalPrice: "number",
    bookingStatus: "string"
  }
};

const validateData = (req, res, next) => {
  if (!["POST", "PUT"].includes(req.method)) {
    return next();
  }

  const resource = req.path.split("/")[1];
  const rules = validationRules[resource];

  if (!rules) {
    return next();
  }

  const data = req.body;

  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    Object.keys(data).length === 0
  ) {
    return res.status(400).json({
      message: "Required data not provided"
    });
  }

  if (req.method === "POST") {
    for (const field of Object.keys(rules)) {
      if (data[field] === undefined || data[field] === null) {
        return res.status(400).json({
          message: `Missing mandatory field: ${field}`
        });
      }
    }
  }

  for (const [field, type] of Object.entries(rules)) {
    if (data[field] === undefined) {
      continue;
    }

    const value = data[field];
    let valid = false;

    if (type === "string") {
      valid =
        typeof value === "string" &&
        value.trim().length > 0;
    }

    if (type === "number") {
      valid =
        typeof value === "number" &&
        Number.isFinite(value);
    }

    if (type === "integer") {
      valid = Number.isInteger(value);
    }

    if (type === "date") {
      valid =
        typeof value === "string" &&
        value.trim().length > 0 &&
        !Number.isNaN(Date.parse(value));
    }

    if (!valid) {
      return res.status(400).json({
        message: `Invalid value for the field: ${field}`
      });
    }
  }

  next();
};

app.use(validateData);


app.get("/", (req, res) => {
  res.send("Hello world!");
});


app.use("/reviews", createReviewRouter(prisma));
app.use("/users", createUserRouter(prisma));
app.use("/hosts", createHostRouter(prisma));
app.use("/properties", createPropertyRouter(prisma));
app.use("/bookings", createBookingRouter(prisma));


app.use(Sentry.Handlers.errorHandler());



app.use((err, req, res, next) => {
  console.error(err);

  if (err.code === "P2025") {
    return res.status(404).json({
      message: "Resource not found"
    });
  }

  if (["P2002", "P2003", "P2014"].includes(err.code)) {
    return res.status(400).json({
      message: "Invalid request data"
    });
  }

  if (err.name === "PrismaClientValidationError") {
    return res.status(400).json({
      message: "Invalid request data"
    });
  }

  res.status(500).json({
    message: "An error occurred on the server, please double-check your request!"
  });
});



app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
