import express from "express";
import * as med from "../controllers/medicamentoController.js";
const router = express.Router();

router.post("/", med.criarMedicamento);
router.get("/", med.listarMedicamentosPorUsuario); // ?telefone=...
router.put("/:id", med.atualizarMedicamento);
router.delete("/:id", med.excluirMedicamento);

export default router;
