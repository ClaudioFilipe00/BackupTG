import { Consumo } from "../models/consumoModel.js";

export const registrarConsumo = async (req, res) => {
  try {
    const { nome, dose, horario, usuarioTelefone, status } = req.body;
    if (!nome || !dose || !horario || !usuarioTelefone || !status)
      return res.status(400).json({ error: "Campos obrigatórios: nome, dose, horario, usuarioTelefone, status" });

    const novo = await Consumo.create({ nome, dose, horario, usuarioTelefone, status });
    return res.status(201).json(novo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao registrar consumo." });
  }
};

export const listarConsumoPorUsuario = async (req, res) => {
  try {
    const { usuarioTelefone } = req.params;
    const consumos = await Consumo.findAll({
      where: { usuarioTelefone },
      order: [["data", "DESC"]],
    });
    return res.json(consumos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar consumos." });
  }
};
