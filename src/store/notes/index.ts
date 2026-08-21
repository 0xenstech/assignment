import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchNotes, createNote, updateNote, deleteNote } from "./actions";
import type { Note } from "./types";

interface NotesState {
  items: Note[];
  loading: boolean;
  error: string;
}

const initialState: NotesState = {
  items: [],
  loading: false,
  error: ""
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    clearNotesError: state => {
      state.error = "";
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotes.pending, state => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchNotes.fulfilled, (state, action: PayloadAction<Note[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to load notes.";
      })
      .addCase(createNote.fulfilled, (state, action: PayloadAction<Note>) => {
        state.items.unshift(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to create note.";
      })
      .addCase(updateNote.fulfilled, (state, action: PayloadAction<Note>) => {
        const index = state.items.findIndex(
          note => note.id === action.payload.id
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to update note.";
      })
      .addCase(
        deleteNote.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.items = state.items.filter(
            note => note.id !== action.payload
          );
        }
      )
      .addCase(deleteNote.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to delete note.";
      });
  }
});

export const { clearNotesError } = notesSlice.actions;
export { fetchNotes, createNote, updateNote, deleteNote };
export default notesSlice.reducer;
