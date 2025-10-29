import { Usuario } from "../models/usuarioModel.js";

export const criarUsuario = async (req, res) => {
  console.log("REQ BODY:", req.body);
  try {
    const { nome, telefone, data_nascimento } = req.body;
    if (!nome || !telefone || !data_nascimento) {
      return res.status(400).json({ error: "Campos obrigatórios faltando." });
    }
    // evita duplicados pelo telefone
    const existing = await Usuario.findOne({ where: { telefone } });
    if (existing) return res.status(409).json({ error: "Telefone já cadastrado." });

    const user = await Usuario.create({ nome, telefone, data_nascimento });
    return res.status(201).json(user);
  } catch (err) {
    console.error("Erro ao criar usuário:", err.message);
    console.error("Stack:", err);
    return res.status(500).json({ error: "Erro ao criar usuário." });
  }

};

// Rota usada para login pelo telefone
export const obterUsuarioPorTelefone = async (req, res) => {
  try {
    const { telefone } = req.params;
    const user = await Usuario.findOne({ where: { telefone } });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar usuário." });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { telefone, data_nascimento } = req.body;
    if (!telefone || !data_nascimento)
      return res.status(400).json({ error: "Telefone e data de nascimento são obrigatórios." });

    const user = await Usuario.findOne({ where: { telefone, data_nascimento } });
    if (!user)
      return res.status(401).json({ error: "Telefone ou data de nascimento incorretos." });

    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao efetuar login." });
  }
};

export const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    // não permite alterar o telefone
    if (updates.telefone) delete updates.telefone;

    const [n] = await Usuario.update(updates, { where: { id } });
    if (!n) return res.status(404).json({ error: "Usuário não encontrado." });
    const updated = await Usuario.findByPk(id);
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
};

export const excluirUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Usuario.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Usuário não encontrado." });
    return res.json({ message: "Usuário excluído." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao excluir usuário." });
  }
};
