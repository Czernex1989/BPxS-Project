const express = require("express");
const cors = require("cors");
const path = require("path");
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

app.use(
  express.static(path.join(__dirname, "../frontend"))
);

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
    const {
      name,
      email,
      note,
      status,
      priority,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Nazwa firmy i e-mail są wymagane",
      });
    }

    const result = await pool.query(
      `INSERT INTO clients (
        name,
        email,
        note,
        status,
        priority
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        name,
        email,
        note || "",
        status || "NOWY",
        priority || "ŚREDNI",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Nie udało się zapisać klienta",
    });
  }
});

app.put("/api/clients/:id", async (req, res) => {
  try {
    const clientId = req.params.id;

    const {
      name,
      email,
      note,
      status,
      priority,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Nazwa firmy i e-mail są wymagane",
      });
    }

    const result = await pool.query(
      `UPDATE clients
       SET
         name = $1,
         email = $2,
         note = $3,
         status = $4,
         priority = $5
       WHERE id = $6
       RETURNING *`,
      [
        name,
        email,
        note || "",
        status || "NOWY",
        priority || "ŚREDNI",
        clientId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Nie znaleziono klienta",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Nie udało się edytować klienta",
    });
  }
});

app.delete("/api/clients/:id", async (req, res) => {
  try {
    const clientId = req.params.id;

    const result = await pool.query(
      `DELETE FROM clients
       WHERE id = $1
       RETURNING *`,
      [clientId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Nie znaleziono klienta",
      });
    }

    res.json({
      message: "Klient został usunięty",
      client: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Nie udało się usunąć klienta",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend działa na http://localhost:${PORT}`);
});