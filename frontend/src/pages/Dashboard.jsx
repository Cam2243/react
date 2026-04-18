import React, { useEffect, useState } from "react";
import api from "../services/api";

const containerStyle = {
  fontFamily: "Arial, sans-serif", padding: "20px", textAlign: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f0f20, #203a43, #2c5364)",
  color: "#fff"
};

const cardStyle = {
  display: "inline-block", padding: "20px 30px", borderRadius: "14px",
  backgroundColor: "rgba(255,255,255,0.1)", marginBottom: "20px",
  backdropFilter: "blur(10px)"
};

function btnStyle(color) {
  return {
    padding: "10px 20px", fontSize: "1rem", borderRadius: "8px",
    border: "none", backgroundColor: color, color: "#fff",
    cursor: "pointer", margin: "5px"
  };
}

const Dashboard = () => {
  const [user, setUser] = useState(null);

  const [mensajeJuego, setMensajeJuego] = useState("Haz clic en Reiniciar para comenzar");
  const [numero, setNumero] = useState("");

  const [pistas, setPistas] = useState(null);
  const [nombreIntento, setNombreIntento] = useState("");
  const [resultadoPoke, setResultadoPoke] = useState(null);
  const [imagenPoke, setImagenPoke] = useState(null);

  useEffect(() => {
    api.get("/auth/user")
      .then(res => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  // Funciones juego número
  const reiniciarJuego = async () => {
    const res = await api.get("/api/start");
    setMensajeJuego(res.data.mensaje);
    setNumero("");
  };

  const enviarIntento = async () => {
    if (!numero) return;
    const res = await api.post("/api/guess", { numero: Number(numero) });
    setMensajeJuego(res.data.mensaje);
  };

  const iniciarPokemon = async () => {
    setResultadoPoke(null);
    setImagenPoke(null);
    setNombreIntento("");
    const res = await api.get("/api/pokemon/start");
    setPistas(res.data.pistas);
    setResultadoPoke(res.data.mensaje);
  };

  const adivinarPokemon = async () => {
    if (!nombreIntento) return;
    const res = await api.post("/api/pokemon/guess", { nombre: nombreIntento });
    setResultadoPoke(res.data.mensaje);
    setImagenPoke(res.data.imagen);
  };

  if (!user) return (
    <div style={containerStyle}>
      <h2 style={{ color: "#ddd", marginTop: "40vh" }}>Cargando datos de sesión...</h2>
    </div>
  );

  return (
    <div style={containerStyle}>

      {/* Perfil */}
      <div style={cardStyle}>
        <h1 style={{ marginBottom: "10px" }}>Hola, {user.displayName}</h1>
        <p style={{ color: "#ccc", margin: "10px 0 20px 0", fontSize: "0.95rem" }}>{user.emails?.[0]?.value}</p>
        <img
          src={user.photos?.[0]?.value}
          alt="Foto de perfil"
          style={{ borderRadius: "50%", width: "70px", height: "70px",
            objectFit: "cover", border: "3px solid #4285F4", marginTop: "10px" }}
        />
      </div>

      <hr style={{ margin: "20px auto", width: "60%", borderColor: "#ffffff33" }} />

      {/* Juego número */}
      <h1>🎲 Juego: Adivina el Número</h1>
      <p style={{ fontSize: "1.2rem", color: "#f9ca24" }}>{mensajeJuego}</p>
      <input
        type="number" value={numero}
        onChange={e => setNumero(e.target.value)}
        placeholder="Escribe un número"
        style={{ padding: "10px 15px", fontSize: "1rem", borderRadius: "8px",
          border: "2px solid #0984e3", width: "150px", textAlign: "center",
          marginBottom: "15px", backgroundColor: "#ffffff22", color: "#fff" }}
      />
      <br />
      <button onClick={enviarIntento} style={btnStyle("#00b894")}>Intentar</button>
      <button onClick={reiniciarJuego} style={btnStyle("#0984e3")}>Reiniciar Juego</button>

      <hr style={{ margin: "30px auto", width: "60%", borderColor: "#ffffff33" }} />

      {/* Juego Pokémon */}
      <h1>🎮 Juego: Adivina el Pokémon</h1>
      <button onClick={iniciarPokemon} style={btnStyle("#6c5ce7")}>Nuevo Pokémon</button>

      {pistas && (
        <div style={{ ...cardStyle, marginTop: "15px", textAlign: "left" }}>
          <p><strong>ID:</strong> {pistas.id}</p>
          <p><strong>Tipo(s):</strong> {pistas.types.join(", ")}</p>
          <p><strong>Color:</strong> {pistas.color}</p>
          <p><strong>Altura:</strong> {pistas.height / 10} m</p>
          <p><strong>Peso:</strong> {pistas.weight / 10} kg</p>
          <p><strong>Ataques:</strong> {pistas.moves.join(", ")}</p>
        </div>
      )}

      {pistas && (
        <div style={{ marginTop: "15px" }}>
          <input
            type="text" value={nombreIntento}
            onChange={e => setNombreIntento(e.target.value)}
            placeholder="Nombre del Pokémon"
            style={{ padding: "10px 15px", fontSize: "1rem", borderRadius: "8px",
              border: "2px solid #6c5ce7", width: "200px", textAlign: "center",
              marginBottom: "10px", backgroundColor: "#ffffff22", color: "#fff" }}
          />
          <br />
          <button onClick={adivinarPokemon} style={btnStyle("#6c5ce7")}>Adivinar</button>
        </div>
      )}

      {resultadoPoke && (
        <p style={{ fontSize: "1.2rem", color: "#fd79a8", marginTop: "10px" }}>
          {resultadoPoke}
        </p>
      )}
      {imagenPoke && (
        <img src={imagenPoke} alt="Pokemon"
          style={{ width: "150px", marginTop: "10px" }} />
      )}

    </div>
  );
};

export default Dashboard;