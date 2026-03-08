const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

router.get("/", usuariosController.getUsuarios);
router.post("/cadastro", usuariosController.cadastrarUsuario);
router.delete("/:id", usuariosController.deletarUsuario);
router.put("/:id", usuariosController.atualizarUsuario);
router.post("/login", usuariosController.loginUsuario);
router.get("/me", usuariosController.getUsuarioLogado);

module.exports = router;
