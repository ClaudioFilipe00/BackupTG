import express from "express";
import * as usuarioCtrl from "../controllers/usuarioController.js";

const router = express.Router();

router.post("/", usuarioCtrl.criarUsuario);
router.get("/:telefone", usuarioCtrl.obterUsuarioPorTelefone);
router.put("/:id", usuarioCtrl.atualizarUsuario);
router.delete("/:id", usuarioCtrl.excluirUsuario);
router.get("/telefone/:telefone", usuarioCtrl.obterUsuarioPorTelefone);
router.post("/login", usuarioCtrl.loginUsuario);

export default router;
