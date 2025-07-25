import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";
import { supabase } from "./supabaseClient";
import "./App.css";

/**
 * Top-level App for simple notes manager
 * Handles notes CRUD and layout with navbar, sidebar, and main content.
 */
// PUBLIC_INTERFACE
function App() {
  // All notes
  const [notes, setNotes] = useState([]);
  // Selected note id
  const [selectedId, setSelectedId] = useState(null);
  // For (new/edit) note:
  const [editing, setEditing] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all notes
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false });
    if (!error) setNotes(data || []);
    setLoading(false);
    // If after CRUD, re-select relevant
    if (data && selectedId) {
      const existing = data.find(n => n.id === selectedId);
      if (!existing) {
        setSelectedId(data.length > 0 ? data[0].id : null);
      }
    }
  }, [selectedId]);

  // Load notes on mount
  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line
  }, []);

  // View a note by id
  const selectNote = (id) => {
    setSelectedId(id);
    setEditing(false);
    setIsNew(false);
    setEditingNote(null);
  };

  // Click new note
  const handleNewNote = () => {
    setEditingNote({ title: "", content: "" });
    setEditing(true);
    setIsNew(true);
    setSelectedId(null);
  };

  // Edit existing note
  const handleEditNote = () => {
    const n = notes.find(n => n.id === selectedId);
    setEditingNote(n);
    setEditing(true);
    setIsNew(false);
  };

  // Handle form changes when editing/creating
  const handleNoteChange = (note) => {
    setEditingNote(note);
  };

  // Save note (create or update)
  const handleSaveNote = async (note) => {
    setNoteLoading(true);
    if (isNew) {
      // Create
      const { data, error } = await supabase
        .from("notes")
        .insert([{ title: note.title, content: note.content }])
        .select(); // select returns the inserted note(s)
      if (!error && data && data[0]) {
        await fetchNotes();
        setSelectedId(data[0].id);
        setEditing(false);
        setIsNew(false);
      }
    } else {
      // Update
      const { error } = await supabase
        .from("notes")
        .update({ title: note.title, content: note.content })
        .eq("id", editingNote.id);
      if (!error) {
        await fetchNotes();
        setSelectedId(editingNote.id);
        setEditing(false);
      }
    }
    setNoteLoading(false);
  };

  // Delete note
  const handleDeleteNote = async (note) => {
    setNoteLoading(true);
    await supabase.from("notes").delete().eq("id", note.id);
    await fetchNotes();
    setEditing(false);
    setSelectedId(null);
    setEditingNote(null);
    setIsNew(false);
    setNoteLoading(false);
  };

  // Cancel editing/creating
  const handleCancel = () => {
    setEditing(false);
    setIsNew(false);
    setEditingNote(null);
    if (notes.length > 0 && selectedId === null) setSelectedId(notes[0].id);
  };

  // Decide which note to render as "selected"
  const selectedNote = selectedId
    ? notes.find(n => n.id === selectedId)
    : null;

  // Layout: Top navbar -> sidebar (notes) -> main area (editor/view)
  return (
    <div className="App" style={{
      background: "#fff",
      color: "#000",
      minHeight: "100vh"
    }}>
      <Navbar />
      <div style={{
        display: "flex",
        alignItems: "stretch",
        height: "calc(100vh - 56px)"
      }}>
        <Sidebar
          notes={notes}
          selectedId={selectedId}
          onSelect={selectNote}
          onNewClick={handleNewNote}
        />
        <main style={{
          flex: 1,
          background: "#fff",
          minHeight: "calc(100vh - 56px)",
          boxSizing: "border-box"
        }}>
          {loading ? (
            <div style={{ margin: 80, color: "#666" }}>Loading...</div>
          ) : (
            <NoteEditor
              note={editing ? editingNote : selectedNote}
              isEditing={editing || isNew}
              onChange={handleNoteChange}
              onSave={handleSaveNote}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              onCancel={handleCancel}
              isNew={isNew}
              loading={noteLoading}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
