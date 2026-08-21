const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const notesStore = require('../../data/notesStore');

const parseId = (raw) => {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
};

router.post(
  '/',
  [
    check('title', 'Title is required').isString().notEmpty(),
    check('content', 'Content is required').isString().notEmpty()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const note = notesStore.create({ title, content });

    console.log('[Notes API] Created note:', note);
    res.status(201).json(note);
  }
);

// GET api/notes

router.get('/', (req, res) => {
  const notes = notesStore.getAll();

  console.log(`[Notes API] Retrieved ${notes.length} note(s)`);
  res.json(notes);
});

// GET api/notes/:id

router.get('/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ msg: 'Invalid note ID' });
  }

  const note = notesStore.getById(id);
  if (!note) {
    return res.status(404).json({ msg: 'Note not found' });
  }

  console.log('[Notes API] Retrieved note:', note);
  res.json(note);
});

// PUT api/notes/:id
router.put(
  '/:id',
  [
    check('title', 'Title must be a non-empty string')
      .optional()
      .isString()
      .notEmpty(),
    check('content', 'Content must be a non-empty string')
      .optional()
      .isString()
      .notEmpty()
  ],
  (req, res) => {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ msg: 'Invalid note ID' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    if (title === undefined && content === undefined) {
      return res
        .status(400)
        .json({ msg: 'At least one of title or content is required' });
    }

    const note = notesStore.update(id, { title, content });
    if (!note) {
      return res.status(404).json({ msg: 'Note not found' });
    }

    console.log('[Notes API] Updated note:', note);
    res.json(note);
  }
);

// DELETE api/notes/:id
router.delete('/:id', (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) {
    return res.status(400).json({ msg: 'Invalid note ID' });
  }

  const deleted = notesStore.remove(id);
  if (!deleted) {
    return res.status(404).json({ msg: 'Note not found' });
  }

  console.log(`[Notes API] Deleted note ${id}`);
  res.json({ msg: 'Note removed' });
});

module.exports = router;
