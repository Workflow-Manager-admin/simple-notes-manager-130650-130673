import React, { useState, useEffect } from "react";

/**
 * Note editor and viewer component.
 * Handles both editing and read-only display.
 * @param {object} note - the note being viewed/edited
 * @param {Boolean} isEditing - true if currently editing
 * @param {Function} onChange - called when note changes in the form
 * @param {Function} onSave - called when "Save" is clicked (new or edit)
 * @param {Function} onEdit - called when "Edit" is requested
 * @param {Function} onDelete - called when "Delete" is clicked
 * @param {Function} onCancel - called when edit is canceled
 * @param {Boolean} isNew - true if creating new note
 * @param {Boolean} loading - if true, disables all actions
 */
 // PUBLIC_INTERFACE
function NoteEditor({
  note,
  isEditing,
  onChange,
  onSave,
  onEdit,
  onDelete,
  onCancel,
  isNew,
  loading
}) {
  const [localNote, setLocalNote] = useState(note || {});

  useEffect(() => {
    setLocalNote(note || {});
  }, [note]);

  // Controlled form handlers when editing/creating
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...localNote, [name]: value };
    setLocalNote(updated);
    onChange && onChange(updated);
  };

  if (!note && !isEditing && !isNew) {
    return (
      <div style={{
        padding: 48, color: "#666",
        fontSize: "1.1rem"
      }}>
        Select a note from the sidebar
      </div>
    );
  }

  // Viewing note
  if (!isEditing && !isNew) {
    return (
      <div style={{ padding: "32px 40px", maxWidth: 720, margin: "0 auto" }}>
        <h2 style={{ color: "#000", marginBottom: 0 }}>
          {note?.title || <em style={{ color: "#666" }}>(No Title)</em>}
        </h2>
        <div style={{ color: "#666", fontSize: "0.94rem" }}>
          Last updated: {note?.updated_at ? (new Date(note.updated_at)).toLocaleString() : "N/A"}
        </div>
        <hr style={{ borderColor: "#ccc", margin: "20px 0" }} />
        <div style={{ whiteSpace: "pre-wrap", fontSize: "1.11rem", minHeight: 120 }}>
          {note?.content || <span style={{ color: "#ccc" }}>(No content)</span>}
        </div>
        <div style={{ marginTop: 32 }}>
          <button
            style={buttonStyle("view")}
            onClick={onEdit}
          >Edit</button>
          <button style={buttonStyle("danger")}
                  onClick={() => window.confirm("Delete this note?") && onDelete(note)}
          >Delete</button>
        </div>
      </div>
    );
  }

  // Editing or creating
  return (
    <form
      style={{
        padding: "32px 40px",
        maxWidth: 720,
        margin: "0 auto"
      }}
      onSubmit={e => {
        e.preventDefault();
        onSave && onSave(localNote);
      }}
      autoComplete="off"
    >
      <label style={labelStyle}>Title</label>
      <input
        name="title"
        value={localNote.title || ""}
        onChange={handleInputChange}
        style={inputStyle}
        maxLength={100}
        autoFocus
        disabled={loading}
        required
        placeholder="Note title"
      />
      <label style={labelStyle}>Content</label>
      <textarea
        name="content"
        value={localNote.content || ""}
        onChange={handleInputChange}
        style={{ ...inputStyle, minHeight: 140, fontFamily: "inherit" }}
        maxLength={2000}
        disabled={loading}
        required
        placeholder="Write your notes here..."
      />
      <div style={{ marginTop: 28 }}>
        <button
          style={buttonStyle("save")}
          type="submit"
          disabled={loading}
        >Save</button>
        <button
          style={buttonStyle("cancel")}
          type="button"
          onClick={onCancel}
          disabled={loading}
        >Cancel</button>
        {!isNew && (
          <button
            style={buttonStyle("danger")}
            type="button"
            onClick={() => window.confirm("Delete this note?") && onDelete(localNote)}
            disabled={loading}
          >Delete</button>
        )}
      </div>
    </form>
  );
}

// Choose palette for button type
function buttonStyle(type) {
  let bg, color, border;
  if (type === "save" || type === "view") {
    bg = "#000";
    color = "#fff";
    border = "1px solid #000";
  } else if (type === "danger") {
    bg = "#fff";
    color = "#000";
    border = "1px solid #000";
  } else if (type === "cancel") {
    bg = "#ccc";
    color = "#000";
    border = "1px solid #ccc";
  } else {
    bg = "#000";
    color = "#fff";
    border = "1px solid #000";
  }
  return {
    background: bg,
    color,
    border,
    borderRadius: 5,
    padding: "9px 22px",
    marginRight: 14,
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "1.02rem",
    marginBottom: 10,
    transition: "background 0.15s, color 0.15s, border 0.2s"
  };
}
const labelStyle = {
  fontWeight: 500,
  fontSize: "1rem",
  margin: "22px 0 8px 0",
  display: "block",
  color: "#000"
};
const inputStyle = {
  width: "100%",
  padding: "10px",
  fontSize: "1.07rem",
  border: "1px solid #ccc",
  borderRadius: 5,
  marginBottom: 6,
  background: "#fff",
  color: "#000"
};

export default NoteEditor;
