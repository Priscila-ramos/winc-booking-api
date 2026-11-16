
import { Router } from "express";
import createHostService from "../services/hostService.js";

const createHostRouter = (prisma) => {
  const router = Router();
  const service = createHostService(prisma);

  router.get("/", async (req, res, next) => {
    try {
      const hosts = await service.getAll();
      res.status(200).json(hosts);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const host = await service.getById(req.params.id);

      if (!host) {
        return res.status(404).json({
          message: "Anfitrião não encontrado"
        });
      }

      res.status(200).json(host);
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const host = await service.create(req.body);
      res.status(201).json(host);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const host = await service.update(
        req.params.id,
        req.body
      );

      res.status(200).json(host);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "Anfitrião não encontrado"
        });
      }

      next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      await service.remove(req.params.id);
      
res.status(200).json({
  message: "Anfitrião excluído com sucesso"
});

    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "Anfitrião não encontrado"
        });
      }

      next(error);
    }
  });

  return router;
};

export default createHostRouter;

