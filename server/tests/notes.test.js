const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');

const app = require('../app');
const notesStore = require('../data/notesStore');

beforeEach(() => {
  notesStore.reset();
});

test('GET /api/notes returns an empty list when no notes exist', async () => {
  const res = await request(app).get('/api/notes');

  assert.equal(res.status, 200);
  assert.deepEqual(res.body, []);
});

test('POST /api/notes creates a note', async () => {
  const res = await request(app)
    .post('/api/notes')
    .send({ title: 'Groceries', content: 'Milk, eggs, bread' });

  assert.equal(res.status, 201);
  assert.equal(res.body.title, 'Groceries');
  assert.equal(res.body.content, 'Milk, eggs, bread');
  assert.equal(typeof res.body.id, 'number');
  assert.ok(res.body.createdAt);
  assert.ok(res.body.updatedAt);
});

test('POST /api/notes rejects a missing title', async () => {
  const res = await request(app)
    .post('/api/notes')
    .send({ content: 'No title here' });

  assert.equal(res.status, 400);
  assert.ok(res.body.errors.length > 0);
});

test('POST /api/notes rejects a missing content', async () => {
  const res = await request(app)
    .post('/api/notes')
    .send({ title: 'No content here' });

  assert.equal(res.status, 400);
  assert.ok(res.body.errors.length > 0);
});

test('GET /api/notes lists all created notes', async () => {
  await request(app).post('/api/notes').send({ title: 'A', content: 'a' });
  await request(app).post('/api/notes').send({ title: 'B', content: 'b' });

  const res = await request(app).get('/api/notes');

  assert.equal(res.status, 200);
  assert.equal(res.body.length, 2);
});

test('GET /api/notes/:id returns a single note', async () => {
  const created = await request(app)
    .post('/api/notes')
    .send({ title: 'Find me', content: 'here' });

  const res = await request(app).get(`/api/notes/${created.body.id}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.title, 'Find me');
});

test('GET /api/notes/:id returns 404 for an unknown id', async () => {
  const res = await request(app).get('/api/notes/999');

  assert.equal(res.status, 404);
});

test('GET /api/notes/:id returns 400 for a non-numeric id', async () => {
  const res = await request(app).get('/api/notes/not-a-number');

  assert.equal(res.status, 400);
});

test('PUT /api/notes/:id updates title and content', async () => {
  const created = await request(app)
    .post('/api/notes')
    .send({ title: 'Old', content: 'old content' });

  const res = await request(app)
    .put(`/api/notes/${created.body.id}`)
    .send({ title: 'New', content: 'new content' });

  assert.equal(res.status, 200);
  assert.equal(res.body.title, 'New');
  assert.equal(res.body.content, 'new content');
});

test('PUT /api/notes/:id supports a partial update', async () => {
  const created = await request(app)
    .post('/api/notes')
    .send({ title: 'Old', content: 'old content' });

  const res = await request(app)
    .put(`/api/notes/${created.body.id}`)
    .send({ title: 'New title only' });

  assert.equal(res.status, 200);
  assert.equal(res.body.title, 'New title only');
  assert.equal(res.body.content, 'old content');
});

test('PUT /api/notes/:id returns 404 for an unknown id', async () => {
  const res = await request(app)
    .put('/api/notes/999')
    .send({ title: 'Ghost' });

  assert.equal(res.status, 404);
});

test('PUT /api/notes/:id requires at least one field', async () => {
  const created = await request(app)
    .post('/api/notes')
    .send({ title: 'Old', content: 'old content' });

  const res = await request(app).put(`/api/notes/${created.body.id}`).send({});

  assert.equal(res.status, 400);
});

test('DELETE /api/notes/:id removes a note', async () => {
  const created = await request(app)
    .post('/api/notes')
    .send({ title: 'Delete me', content: 'bye' });

  const deleteRes = await request(app).delete(`/api/notes/${created.body.id}`);
  assert.equal(deleteRes.status, 200);

  const getRes = await request(app).get(`/api/notes/${created.body.id}`);
  assert.equal(getRes.status, 404);
});

test('DELETE /api/notes/:id returns 404 for an unknown id', async () => {
  const res = await request(app).delete('/api/notes/999');

  assert.equal(res.status, 404);
});
