import { Medicamento } from "../models/medicamentoModel.js";
import { Usuario } from "../models/usuarioModel.js";
import { Op } from "sequelize";

export const criarMedicamento = async (req, res) => {
  try {
    const { nome, nome_medico, dose, tipo, duracao, horarios, dias, usuarioTelefone, continuo } = req.body;
    if (!nome || !usuarioTelefone) return res.status(400).json({ error: "nome e usuarioTelefone obrigatórios" });

    const usuario = await Usuario.findOne({ where: { telefone: usuarioTelefone } });
    if (!usuario) return res.status(400).json({ error: "Usuário não encontrado para o telefone informado." });

    const med = await Medicamento.create({
      nome,
      nome_medico: nome_medico || null,
      dose: dose || null,
      tipo: tipo || null,
      duracao: continuo ? "Contínuo" : (duracao || null),
      continuo: !!continuo,
      horarios: JSON.stringify(horarios || []),
      dias: JSON.stringify(dias || {}),
      usuarioTelefone,
      usuarioId: usuario.id,
    });

    return res.status(201).json(med);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao criar medicamento." });
  }
};

export const listarMedicamentosPorUsuario = async (req, res) => {
  try {
    const { telefone } = req.query;
    if (!telefone) return res.status(400).json({ error: "telefone query obrigatório" });

    const usuario = await Usuario.findOne({ where: { telefone } });
    const whereClause = usuario
      ? { [Op.or]: [{ usuarioId: usuario.id }, { usuarioTelefone: telefone }] }
      : { usuarioTelefone: telefone };

    const meds = await Medicamento.findAll({ where: whereClause, order: [["nome", "ASC"]] });

    const parsed = meds.map((m) => ({
      ...m.toJSON(),
      horarios: m.horarios ? JSON.parse(m.horarios) : [],
      dias: m.dias ? JSON.parse(m.dias) : {},
    }));

    return res.json(parsed);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar medicamentos." });
  }
};

export const atualizarMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.horarios) updates.horarios = JSON.stringify(updates.horarios);
    if (updates.dias) updates.dias = JSON.stringify(updates.dias);
    if (typeof updates.continuo !== "undefined") updates.continuo = !!updates.continuo;
    if (updates.continuo) updates.duracao = "Contínuo";

    const [n] = await Medicamento.update(updates, { where: { id } });
    if (!n) return res.status(404).json({ error: "Medicamento não encontrado." });
    const updated = await Medicamento.findByPk(id);
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao atualizar." });
  }
};

export const excluirMedicamento = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Medicamento.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Medicamento não encontrado." });
    return res.json({ message: "Medicamento excluído." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao excluir." });
  }
};
