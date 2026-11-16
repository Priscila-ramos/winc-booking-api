
import { Router } from "express";
import createUserService from "../services/userService.js";

const createUserRouter = (prisma) => {
  const router = Router();
  const service = createUserService(prisma);

  router.get("/", async (req, res, next) => {
    try {
      const users = await service.getAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const user = await service.getById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const user = await service.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const user = await service.update(
        req.params.id,
        req.body
      );

      res.status(200).json(user);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "User not found"
        });
      }

      next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      await service.remove(req.params.id);
      
res.status(200).json({
  message: "User deleted successfully"
});

    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "User not found"
        });
      }

      next(error);
    }
  });

  return router;
};

export default createUserRouter;

