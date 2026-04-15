import { useEffect, useState } from "react";

function App() {
  // --- Estado juego número ---
  const [mensaje, setMensaje] = useState("");
  const [mensajeJuego, setMensajeJuego] = useState("Haz clic en Reiniciar para comenzar");
  const [numero, setNumero] = useState("");

  // --- Estado juego Pokémon ---
  const [pistas, setPistas] = useState(null);
  const [nombreIntento, setNombreIntento] = useState("");
  const [resultadoPoke, setResultadoPoke] = useState(null);
  const [imagenPoke, setImagenPoke] = useState(null);

  useEffect(() => {
    fetch("/api/mensaje")
      .then(res => res.json())
      .then(data => setMensaje(data.texto));
  }, []);

  // Funciones juego número
  const reiniciarJuego = async () => {
    const res = await fetch("/api/start");
    const data = await res.json();
    setMensajeJuego(data.mensaje);
    setNumero("");
  };

  const enviarIntento = async () => {
    if (!numero) return;
    const res = await fetch("/api/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numero: Number(numero) }),
    });
    const data = await res.json();
    setMensajeJuego(data.mensaje);
  };

  // Funciones juego Pokémon
  const iniciarPokemon = async () => {
    setResultadoPoke(null);
    setImagenPoke(null);
    setNombreIntento("");
    const res = await fetch("/api/pokemon/start");
    const data = await res.json();
    setPistas(data.pistas);
    setResultadoPoke(data.mensaje);
  };

  const adivinarPokemon = async () => {
    if (!nombreIntento) return;
    const res = await fetch("/api/pokemon/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nombreIntento }),
    });
    const data = await res.json();
    setResultadoPoke(data.mensaje);
    setImagenPoke(data.imagen);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", textAlign: "center" }}>

      {/* Conexión backend */}
      <h1 style={{ color: "#2d3436" }}>Frontend conectado</h1>
      <p style={{ color: "#0984e3" }}>{mensaje}</p>
      <hr style={{ margin: "20px 0" }} />

      {/* Juego Adivina el Número */}
      <h1>🎲 Juego: Adivina el Número</h1>
      <p style={{ fontSize: "1.2rem", color: "#d63031" }}>{mensajeJuego}</p>
      <input
        type="number"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        placeholder="Escribe un número"
        style={{ padding: "10px 15px", fontSize: "1rem", borderRadius: "8px", border: "2px solid #0984e3", width: "150px", textAlign: "center", marginBottom: "15px" }}
      />
      <br />
      <button onClick={enviarIntento} style={btnStyle("#00b894")}>Intentar</button>
      <button onClick={reiniciarJuego} style={btnStyle("#0984e3")}>Reiniciar Juego</button>

      <hr style={{ margin: "30px 0" }} />

      {/* Juego Adivina el Pokémon */}
      <h1>🎮 Juego: Adivina el Pokémon</h1>

      <button onClick={iniciarPokemon} style={btnStyle("#6c5ce7")}>Nuevo Pokémon</button>

      {pistas && (
        <div style={{ marginTop: "15px", display: "inline-block", textAlign: "left", background: "#f0f0f0", padding: "15px", borderRadius: "10px" }}>
          <p><strong>ID:</strong> {pistas.id}</p>
          <p><strong>Tipo(s):</strong> {pistas.types.join(", ")}</p>
          <p><strong>Color:</strong> {pistas.color}</p>
          <p><strong>Altura:</strong> {pistas.height}</p>
          <p><strong>Peso:</strong> {pistas.weight}</p>
          <p><strong>Ataques:</strong> {pistas.moves.join(", ")}</p>
        </div>
      )}

      {pistas && (
        <div style={{ marginTop: "15px" }}>
          <input
            type="text"
            value={nombreIntento}
            onChange={(e) => setNombreIntento(e.target.value)}
            placeholder="Nombre del Pokémon"
            style={{ padding: "10px 15px", fontSize: "1rem", borderRadius: "8px", border: "2px solid #6c5ce7", width: "200px", textAlign: "center", marginBottom: "10px" }}
          />
          <br />
          <button onClick={adivinarPokemon} style={btnStyle("#6c5ce7")}>Adivinar</button>
        </div>
      )}

      {resultadoPoke && (
        <p style={{ fontSize: "1.2rem", color: "#e17055", marginTop: "10px" }}>{resultadoPoke}</p>
      )}

      {imagenPoke && (
        <img src={imagenPoke} alt="Pokemon" style={{ width: "150px", marginTop: "10px" }} />
      )}

    </div>
  );
}

// Helper para estilos de botones
function btnStyle(color) {
  return {
    padding: "10px 20px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "none",
    backgroundColor: color,
    color: "#fff",
    cursor: "pointer",
    margin: "5px",
  };
}

export default App;