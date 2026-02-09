import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

// middlewares
app.use(cors());
app.use(express.json());

// rota de teste
app.get("/", (req, res) => {
  return res.send("API da Advocacia rodando 🚀");
});

// rota principal (formulário)
app.post("/consultations", async (req, res) => {
  const { name, email, phone, serviceType, description } = req.body;

  if (!name || !email || !phone || !serviceType || !description) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  try {
    const consultation = await prisma.consultation.create({
      data: {
        name,
        email,
        phone,
        serviceType,
        description
      }
    });

    return res.status(201).json(consultation);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/consultations", async (req, res) => {
  try {
    const consultations = await prisma.consultation.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json(consultations);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar consultas" });
  }
});


// servidor

app.listen(3333, () => {
  console.log("🔥 Servidor rodando em http://localhost:3333");
});
