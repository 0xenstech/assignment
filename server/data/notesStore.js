// in-memory store for notes. 

let notes = [];
let nextId = 1;

const getAll = () => notes;

const getById = (id) => notes.find((note) => note.id === id);

const create = ({ title, content }) => {
  const now = new Date().toISOString();
  const note = {
    id: nextId++,
    title,
    content,
    createdAt: now,
    updatedAt: now
  };
  notes.push(note);
  return note;
};

const update = (id, { title, content }) => {
  const note = getById(id);
  if (!note) return null;

  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;
  note.updatedAt = new Date().toISOString();

  return note;
};

const remove = (id) => {
  const index = notes.findIndex((note) => note.id === id);
  if (index === -1) return false;

  notes.splice(index, 1);
  return true;
};

// Resets the store
const reset = () => {
  notes = [];
  nextId = 1;
};

module.exports = { getAll, getById, create, update, remove, reset };
