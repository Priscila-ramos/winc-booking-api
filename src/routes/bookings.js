
import { Router } from "express";
import createBookingService from "../services/bookingService.js";

const createBookingRouter = (prisma) => {
  const router = Router();
  const service = createBookingService(prisma);

  router.get("/", async (req, res, next) => {
    try {
      const bookings = await service.getAll();
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const booking = await service.getById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          message: "Reserva não encontrada"
        });
      }

      res.status(200).json(booking);
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const booking = await service.create(req.body);
      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const booking = await service.update(
        req.params.id,
        req.body
      );

      res.status(200).json(booking);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "Reserva não encontrada"
        });
      }

      next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      await service.remove(req.params.id);
      
res.status(200).json({
  message: "Reserva excluída com sucesso"
});

    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "Reserva não encontrada"
        });
      }

      next(error);
    }
  });

  return router;
};

export default createBookingRouter;

