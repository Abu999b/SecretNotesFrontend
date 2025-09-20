import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Notes.css";

export default function Notes({ token, setToken }) {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const fetchNotes = async () => {
    try {
      const res = await axios.get("https://secretnotesbackend.onrender.com/api/notes", {
        headers: { Authorization: token },
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [token]);

  const addNote = async () => {
    if (!content.trim()) return;
    await axios.post(
      "https://secretnotesbackend.onrender.com/api/notes",
      { content },
      { headers: { Authorization: token } }
    );
    setContent("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`https://secretnotesbackend.onrender.com/api/notes/${id}`, {
      headers: { Authorization: token },
    });
    fetchNotes();
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditContent(note.content);
  };

  const saveEdit = async (id) => {
    await axios.put(
      `https://secretnotesbackend.onrender.com/api/notes/${id}`,
      { content: editContent },
      { headers: { Authorization: token } }
    );
    setEditingId(null);
    setEditContent("");
    fetchNotes();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <div>
      <div className="notes-form">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a note..."
        />
        <button onClick={addNote}>Add</button>
        <button onClick={logout}>Logout</button>
      </div>

      <ul className="notes-list">
        {notes.map((note) => (
          <li key={note._id} className="note-item">
            {editingId === note._id ? (
              <>
                <input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button onClick={() => saveEdit(note._id)}>Save</button>
              </>
            ) : (
              <>
                <span>{note.content}</span>
                <div>
                  <button onClick={() => startEdit(note)}>Edit</button>
                  <button onClick={() => deleteNote(note._id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

