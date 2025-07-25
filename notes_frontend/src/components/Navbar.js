import React from "react";

/**
 * The main top navigation bar for the notes app.
 * Minimalistic, light-themed style.
 */
// PUBLIC_INTERFACE
function Navbar() {
  return (
    <nav style={{
      height: "56px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#1976d2",
      color: "#fff",
      padding: "0 2rem",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
    }}>
      <span style={{ fontWeight: 600, fontSize: "1.2rem", letterSpacing: 2 }}>
        Notes
      </span>
      <span style={{ fontSize: "0.95rem" }}>
        Minimal Notes Manager
      </span>
    </nav>
  );
}

export default Navbar;
