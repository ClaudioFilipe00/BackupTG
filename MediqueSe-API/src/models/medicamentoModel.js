import { DataTypes } from "sequelize";
import { sequelize } from "../db/connection.js";
import { Usuario } from "./usuarioModel.js";

export const Medicamento = sequelize.define("Medicamento", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  nome_medico: { type: DataTypes.STRING, allowNull: true },
  dose: { type: DataTypes.STRING, allowNull: false }, // valor (ex: "3")
  tipo: { type: DataTypes.STRING, allowNull: false }, // tipo (ex: "comprimido")
  duracao: { type: DataTypes.STRING, allowNull: true }, // ex: "7 dias" ou "Contínuo"
  continuo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  horarios: { type: DataTypes.TEXT, allowNull: true }, // JSON string
  dias: { type: DataTypes.TEXT, allowNull: true }, // JSON string

  // Mantemos o telefone (compatibilidade) e adicionamos FK usuarioId
  usuarioTelefone: { type: DataTypes.STRING, allowNull: true },
  usuarioId: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: "medicamentos",
  timestamps: true
});

// Associação — garante onDelete CASCADE via usuarioId
Usuario.hasMany(Medicamento, {
  foreignKey: "usuarioId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Medicamento.belongsTo(Usuario, {
  foreignKey: "usuarioId",
});
