import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import type { Note, NotePayload } from "./types";

const NOTES_URL = "/api/notes";

const extractErrorMessage = (error: any, fallback: string): string => {
  return error?.errors?.[0]?.msg || error?.msg || fallback;
};

export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (_: void, { rejectWithValue }) => {
    try {
      const notes: Note[] = await api.get(NOTES_URL);
      return notes;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, "Failed to load notes."));
    }
  }
);

export const createNote = createAsyncThunk(
  "notes/createNote",
  async (payload: NotePayload, { rejectWithValue }) => {
    try {
      const note: Note = await api.post(NOTES_URL, payload);
      return note;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, "Failed to create note."));
    }
  }
);

export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async (
    { id, ...payload }: NotePayload & { id: number },
    { rejectWithValue }
  ) => {
    try {
      const note: Note = await api.put(`${NOTES_URL}/${id}`, payload);
      return note;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, "Failed to update note."));
    }
  }
);

export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`${NOTES_URL}/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, "Failed to delete note."));
    }
  }
);
