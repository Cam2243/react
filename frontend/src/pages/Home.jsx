import React from "react";

const containerStyle = {
  display: "flex", justifyContent: "center", alignItems: "center",
  height: "100vh", width: "100vw",
  background: "linear-gradient(135deg, #0f0f2027, #203a43, #2c5364)"
};

const cardStyle = {
  width: "100%", maxWidth: "500px", padding: "50px 40px",
  borderRadius: "18px", backgroundColor: "rgba(255,255,255,0.1)",
  boxShadow: "0 10px 35px rgba(0,0,0,0.4)", textAlign: "center",
  backdropFilter: "blur(12px)", color: "#fff"
};

const buttonStyle = {
  display: "flex", alignItems: "center", justifyContent: "center",
  width: "100%", padding: "14px 25px", backgroundColor: "#4285F4",
  color: "#fff", border: "none", borderRadius: "8px",
  fontSize: "17px", fontWeight: "600", cursor: "pointer"
};

const Home = () => {
  const handleLogin = () => {
    window.location.href = "https://obscure-space-giggle-jv65794j66phqgxr-3000.app.github.dev/auth/google";
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ marginBottom: "10px" }}>Bienvenido 👋</h1>
        <p style={{ color: "#ddd", marginBottom: "35px" }}>
          Inicia sesión para acceder al juego Pokémon.
        </p>
        <button onClick={handleLogin} style={buttonStyle}>
          <span style={{ marginRight: "10px", fontSize: "20px" }}>🌐</span>
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
};

export default Home;