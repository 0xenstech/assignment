import type { RootState } from "../store";

export const selectNotes = (state: RootState) => state.notes.items;
export const selectNotesLoading = (state: RootState) => state.notes.loading;
export const selectNotesError = (state: RootState) => state.notes.error;
