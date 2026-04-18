import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

dotenv.config();

const app = express();
const PORT = 3000;

const FRONTEND_URL = "https://obscure-space-giggle-jv65794j66phqgxr-5173.app.github.dev";
const BACKEND_URL  = "https://obscure-space-giggle-jv65794j66phqgxr-3000.app.github.dev";

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, sameSite: "lax" }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${BACKEND_URL}/auth/google/callback`
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// =====================
// RUTAS DE AUTENTICACIÓN
// =====================
app.get("/", (req, res) => res.send("Servidor funcionando correctamente"));

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(`${FRONTEND_URL}/dashboard`);
  }
);

app.get("/auth/user", (req, res) => {
  res.send(req.user || null);
});

function estaAutenticado(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ mensaje: "No autenticado" });
}

// =====================
// RUTA DE PRUEBA
// =====================
app.get("/api/mensaje", (req, res) => {
  res.json({ texto: "Hola desde el backend " });
});

// =====================
// JUEGO: ADIVINA EL NÚMERO
// =====================
let numeroSecreto = Math.floor(Math.random() * 100) + 1;

app.get("/api/start", estaAutenticado, (req, res) => {
  numeroSecreto = Math.floor(Math.random() * 100) + 1;
  res.json({ mensaje: "Nuevo juego iniciado. Adivina un número entre 1 y 100." });
});

app.post("/api/guess", estaAutenticado, (req, res) => {
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

app.get("/api/pokemon/start", estaAutenticado, async (req, res) => {
  try {
    const idAleatorio = Math.floor(Math.random() * 151) + 1;
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

app.post("/api/pokemon/guess", estaAutenticado, (req, res) => {
  const intento = req.body.nombre?.toLowerCase().trim();
  if (!intento) return res.status(400).json({ mensaje: "Debes enviar un nombre." });
  if (!pokemonSecreto) return res.status(400).json({ mensaje: "Primero inicia el juego." });

  const correcto = intento === pokemonSecreto.name;
  res.json({
    correcto,
    mensaje: correcto
      ? `¡Correcto! Es ${pokemonSecreto.name} 🎉`
      : `Incorrecto, el Pokémon era ${pokemonSecreto.name} 😢`,
    imagen: pokemonSecreto.image,
  });
});

app.listen(PORT, () => console.log(`Servidor backend corriendo en http://localhost:${PORT}`));