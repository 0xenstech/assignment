import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
  clearNotesError
} from "../../store/notes";
import {
  selectNotes,
  selectNotesLoading,
  selectNotesError
} from "../../store/notes/selectors";
import ConfirmModal from "../../components/modal/ConfirmModal";
import type { Note } from "../../store/notes/types";

const emptyForm = { title: "", content: "" };

const Notes = () => {
  const dispatch = useAppDispatch();
  const notes = useAppSelector(selectNotes);
  const loading = useAppSelector(selectNotesLoading);
  const error = useAppSelector(selectNotesError);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = (evt: React.FormEvent) => {
    evt.preventDefault();
    const payload = { title: form.title.trim(), content: form.content.trim() };
    if (!payload.title || !payload.content) return;

    if (editingId !== null) {
      dispatch(updateNote({ id: editingId, ...payload }));
    } else {
      dispatch(createNote(payload));
    }
    resetForm();
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setForm({ title: note.title, content: note.content });
  };

  const handleDeleteConfirm = (status: boolean) => {
    if (status && pendingDeleteId !== null) {
      dispatch(deleteNote(pendingDeleteId));
    }
    setPendingDeleteId(null);
  };

  return (
    <Box sx={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, marginBottom: "24px" }}>
        Notes
      </Typography>

      <Card component="form" onSubmit={handleSubmit} sx={{ marginBottom: "32px" }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TextField
            label="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="Content"
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            required
            multiline
            minRows={3}
            fullWidth
          />
        </CardContent>
        <CardActions sx={{ padding: "0 16px 16px", gap: "8px" }}>
          <Button type="submit" variant="contained">
            {editingId !== null ? "Save changes" : "Add note"}
          </Button>
          {editingId !== null && (
            <Button variant="text" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </CardActions>
      </Card>

      {loading && <Typography sx={{ marginBottom: "16px" }}>Loading notes...</Typography>}

      {!loading && notes.length === 0 && (
        <Typography sx={{ opacity: 0.6, fontStyle: "italic" }}>
          No notes yet. Add one above.
        </Typography>
      )}

      <Grid container spacing={2}>
        {notes.map(note => (
          <Grid item xs={12} sm={6} key={note.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{note.title}</Typography>
                <Typography sx={{ whiteSpace: "pre-wrap", marginTop: "8px" }}>
                  {note.content}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.6, display: "block", marginTop: "12px" }}>
                  Updated {new Date(note.updatedAt).toLocaleString()}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                <IconButton aria-label="Edit note" onClick={() => handleEdit(note)}>
                  <EditNoteIcon />
                </IconButton>
                <IconButton
                  aria-label="Delete note"
                  onClick={() => setPendingDeleteId(note.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <ConfirmModal
        text="Delete this note?"
        openModal={pendingDeleteId !== null}
        handleAction={handleDeleteConfirm}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => dispatch(clearNotesError())}
      >
        <Alert severity="error" onClose={() => dispatch(clearNotesError())}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Notes;
