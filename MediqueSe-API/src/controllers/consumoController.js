import { Consumo } from "../models/consumoModel.js";
import { Medicamento } from "../models/medicamentoModel.js";

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
      include: [
        {
          model: Medicamento,
          required: false,
          attributes: ["nome"],
        },
      ],
      order: [["data", "DESC"]],
    });

    const resultado = consumos.map((c) => {
      // c pode ser instancia do Sequelize com c.dataValues, etc.
      const medicamentoNome = c.Medicamento && c.Medicamento.nome ? c.Medicamento.nome : null;
      const nomeFinal = medicamentoNome || (c.nome ? c.nome : "(sem nome)");
      return {
        id: c.id,
        nome: nomeFinal,
        dose: c.dose,
        horario: c.horario,
        usuarioTelefone: c.usuarioTelefone,
        status: c.status,
        data: c.data,
      };
    });

    return res.json(resultado);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar consumos." });
  }
};
