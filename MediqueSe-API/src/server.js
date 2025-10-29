import express from "express";
import cors from "cors";
import { sequelize } from "./db/connection.js";
import { Usuario } from "./models/usuarioModel.js";
import { Medicamento } from "./models/medicamentoModel.js";
import { Consumo } from "./models/consumoModel.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import medicamentoRoutes from "./routes/medicamentoRoutes.js";
import consumoRoutes from "./routes/consumoRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

Usuario.hasMany(Medicamento, {
  foreignKey: "usuarioId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Medicamento.belongsTo(Usuario, {
  foreignKey: "usuarioId",
});

Usuario.hasMany(Consumo, {
  foreignKey: "usuarioTelefone",
  sourceKey: "telefone",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Consumo.belongsTo(Usuario, {
  foreignKey: "usuarioTelefone",
  targetKey: "telefone",
});

Medicamento.hasMany(Consumo, {
  foreignKey: "medicamentoId",
  onUpdate: "CASCADE",
  onDelete: "SET NULL", // Mantém histórico mesmo que o medicamento seja deletado
});
Consumo.belongsTo(Medicamento, {
  foreignKey: "medicamentoId",
  onDelete: "SET NULL",
});

app.use("/usuarios", usuarioRoutes);
app.use("/medicamentos", medicamentoRoutes);
app.use("/consumo", consumoRoutes);

// Rota de teste
app.get("/ping", (req, res) => res.send("pong"));
app.get("/rota-de-teste", (req, res) => res.send("Backend acessível!"));

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log("Banco sincronizado com sucesso!");
    app.listen(PORT, "0.0.0.0", () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error("Erro ao sincronizar:", err);
  });
