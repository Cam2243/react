import express from "express";
import cors from "cors";


const app = express();
const PORT = 3000;

app.use(cors({
    origin: "*"
}));
app.use(cors());
app.use(express.json());

app.get("/api/mensaje", (req, res) => {
  res.json({ texto: "Hola desde el backend " });
});

let numeroSecreto = Math.floor(Math.random() * 100) + 1;

app.get("/api/start", (req, res) => {
  numeroSecreto = Math.floor(Math.random() * 100) + 1;
  res.json({
    mensaje: "Nuevo juego iniciado. Adivina un número entre 1 y 100.",
    numeroSecreto 
  });
});

// Endpoint para adivinar
app.post("/api/guess", (req, res) => {
  const intento = req.body.numero;

  if (!intento && intento !== 0) {
    return res.status(400).json({ mensaje: "Debes enviar un número." });
  }

  if (intento < numeroSecreto) {
    res.json({ mensaje: "El número secreto es mayor 🔼" });
  } else if (intento > numeroSecreto) {
    res.json({ mensaje: "El número secreto es menor 🔽" });
  } else {
    res.json({ mensaje: "🎉 ¡Correcto! Adivinaste el número." });
  }
});
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});