import React from "react";

/**
 * Sidebar for note listing, showing all note titles
 * @param {object[]} notes - array of note records
 * @param {string} selectedId - id of the selected note
 * @param {Function} onSelect - function to call when selecting
 * @param {Function} onNewClick - function when "New Note" is clicked
 */
 // PUBLIC_INTERFACE
function Sidebar({ notes, selectedId, onSelect, onNewClick }) {
  return (
    <aside style={{
      width: 240,
      background: "#fff",
      borderRight: "1px solid #ccc",
      height: "calc(100vh - 56px)",
      display: "flex",
      flexDirection: "column"
    }}>
      <button
        style={{
          margin: "16px",
          background: "#000",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "10px 0",
          fontWeight: 600,
          cursor: "pointer",
          letterSpacing: 1,
          fontSize: "1rem"
        }}
        onClick={onNewClick}
        aria-label="Create new note"
      >+ New Note</button>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {notes.length === 0 && (
          <div style={{ padding: "1rem", color: "#999", fontSize: "0.96rem" }}>
            No notes yet
          </div>
        )}
        {notes.map(note => (
          <button
            key={note.id}
            style={{
              display: "block",
              background: note.id === selectedId ? "#333" : "#fff",
              color: note.id === selectedId ? "#fff" : "#191919",
              textAlign: "left",
              border: "none",
              width: "100%",
              padding: "12px 16px",
              borderBottom: "1px solid #ececec",
              cursor: "pointer",
              transition: "background 0.1s"
            }}
            onClick={() => onSelect(note.id)}
            aria-current={note.id === selectedId ? "true" : undefined}
          >
            <span style={{
              fontWeight: note.id === selectedId ? 700 : 500,
              fontSize: "1rem"
            }}>{note.title || <em>(No Title)</em>}</span>
            <br />
            <span style={{
              color: "#666",
              fontSize: "0.88rem"
            }}>{note.updated_at ? (new Date(note.updated_at)).toLocaleString() : ""}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
