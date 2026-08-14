const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("BPxS backend działa!");
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Połączenie z bazą działa!",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Błąd połączenia z bazą",
    });
  }
});

app.get("/clients", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM clients ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Nie udało się pobrać klientów",
    });
  }
});

app.post("/api/clients", async (req, res) => {
  try {
    const name =
      req.body.name ||
      req.body.company ||
      req.body.companyName;

    const email = req.body.email;
    const note =
      req.body.note ||
      req.body.description ||
      "";

    if (!name || !email) {
      return res.status(400).json({
        error: "Nazwa firmy i e-mail są wymagane",
      });
    }

    const result = await pool.query(
      `INSERT INTO clients (name, email, note)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, note]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Nie udało się zapisać klienta",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend działa na http://localhost:${PORT}`);
});