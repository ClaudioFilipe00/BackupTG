import { DataTypes } from "sequelize";
import { sequelize } from "../db/connection.js";

export const Usuario = sequelize.define("Usuario", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nome: { type: DataTypes.STRING(100), allowNull: false },
  telefone: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  data_nascimento: { type: DataTypes.DATEONLY, allowNull: false },
}, {
  tableName: "usuarios",
  timestamps: true,
  createdAt: "criado_em",
  updatedAt: false
});
