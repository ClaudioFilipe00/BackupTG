import express from "express";
import { registrarConsumo, listarConsumoPorUsuario } from "../controllers/consumoController.js";

const router = express.Router();

router.post("/", registrarConsumo);
router.get("/:usuarioTelefone", listarConsumoPorUsuario);

export default router;
