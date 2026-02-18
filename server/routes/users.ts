import express from "express";
import clienteController from "../controllers/clienteControllers";

const router = express.Router();

router.get("/", clienteController.getAllClientes);
router.get("/:id/compras", clienteController.getClienteConCompras); // ← populate
router.get("/:id", clienteController.getClienteById);
router.post("/", clienteController.createCliente);
router.put("/:id", clienteController.updateCliente);
router.delete("/:id", clienteController.deleteCliente);

export default router;
