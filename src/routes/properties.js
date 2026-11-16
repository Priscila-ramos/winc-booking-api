
import { Router } from "express";
import createPropertyService from "../services/propertyService.js";

const createPropertyRouter = (prisma) => {
  const router = Router();
  const service = createPropertyService(prisma);

  router.get("/", async (req, res, next) => {
    try {
      const properties = await service.getAll();
      res.status(200).json(properties);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const property = await service.getById(req.params.id);

      if (!property) {
        return res.status(404).json({
          message: "Property not found"
        });
      }

      res.status(200).json(property);
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const property = await service.create(req.body);
      res.status(201).json(property);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const property = await service.update(
        req.params.id,
        req.body
      );

      res.status(200).json(property);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "Property not found"
        });
      }

      next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      await service.remove(req.params.id);

      res.status(200).json({
        message: "Property deleted succesfully"
      });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "Property not found"
        });
      }

      next(error);
    }
  });

  return router;
};

export default createPropertyRouter;

