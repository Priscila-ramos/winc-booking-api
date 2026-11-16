
import { Router } from "express";
import createReviewService from "../services/reviewService.js";

const createReviewRouter = (prisma) => {
  const router = Router();
  const service = createReviewService(prisma);

  router.get("/", async (req, res, next) => {
    try {
      const reviews = await service.getAll();
      res.status(200).json(reviews);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const review = await service.getById(req.params.id);

      if (!review) {
        return res.status(404).json({
          message: "Review not found"
        });
      }

      res.status(200).json(review);
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const review = await service.create(req.body);
      res.status(201).json(review);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const review = await service.update(
        req.params.id,
        req.body
      );

      res.status(200).json(review);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "Review not found"
        });
      }

      next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      await service.remove(req.params.id);
      
res.status(200).json({
  message: "Review deleted successfully"
});

    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "Review not found"
        });
      }

      next(error);
    }
  });

  return router;
};

export default createReviewRouter;

