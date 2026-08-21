interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface NotePayload {
  title: string;
  content: string;
}

export type { Note, NotePayload };
