// src/db/connection.js
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME || "neondb",
  process.env.DB_USER || "neondb_owner",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "ep-proud-wave-ad5uqh5b-pooler.c-2.us-east-1.aws.neon.tech",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    dialect: "postgres",
    dialectOptions: {
      ssl: { require: true, rejectUnauthorized: false },
    },
    logging: false,
  }
);
