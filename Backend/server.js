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

// =====================
// JUEGO: ADIVINA EL NUMERO
// =====================

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

// =====================
// JUEGO: ADIVINA EL POKÉMON
// =====================

let pokemonSecreto = null;

// Endpoint para iniciar/reiniciar el juego Pokémon
app.get("/api/pokemon/start", async (req, res) => {
  try {
    const idAleatorio = Math.floor(Math.random() * 151) + 1; // Gen 1
    const resPoke = await fetch(`https://pokeapi.co/api/v2/pokemon/${idAleatorio}`);
    const data = await resPoke.json();

    const resSpecies = await fetch(data.species.url);
    const species = await resSpecies.json();

    pokemonSecreto = {
      name: data.name,
      id: data.id,
      types: data.types.map(t => t.type.name),
      height: data.height,
      weight: data.weight,
      color: species.color.name,
      moves: data.moves.slice(0, 3).map(m => m.move.name),
      image: data.sprites.other?.dream_world?.front_default || data.sprites.front_default,
    };

    res.json({
      mensaje: "Nuevo Pokémon listo. ¡Adivina cuál es!",
      pistas: {
        id: pokemonSecreto.id,
        types: pokemonSecreto.types,
        height: pokemonSecreto.height,
        weight: pokemonSecreto.weight,
        color: pokemonSecreto.color,
        moves: pokemonSecreto.moves,
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el Pokémon." });
  }
});

// Endpoint para verificar el intento del jugador
app.post("/api/pokemon/guess", (req, res) => {
  const intento = req.body.nombre?.toLowerCase().trim();

  if (!intento) {
    return res.status(400).json({ mensaje: "Debes enviar un nombre." });
  }

  if (!pokemonSecreto) {
    return res.status(400).json({ mensaje: "Primero inicia el juego." });
  }

  const correcto = intento === pokemonSecreto.name;

  res.json({
    correcto,
    mensaje: correcto
      ? `¡Correcto! Es ${pokemonSecreto.name} 🎉`
      : `Incorrecto, el Pokémon era ${pokemonSecreto.name} 😢`,
    imagen: pokemonSecreto.image,
    nombre: pokemonSecreto.name,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});