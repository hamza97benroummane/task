const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const DATA_PATH = process.env.DATA_PATH || path.join(__dirname, '../../../data/items.json');
// Utility to read data non blocking 
async function readData() {
  try {
    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    if (e.code === 'ENOENT') return []; // fs not created yet
    throw e;
  }
}
// Async writer
async function writeData(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// GET /api/items  (server-side search  pagination)
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const { q = '', page = '1', pageSize = '20' } = req.query;

    // filter by query (case-insensitive substring on name)
    let filtered = q
      ? data.filter((item) =>
          String(item.name || '').toLowerCase().includes(String(q).toLowerCase())
        )
      : data;

    const total = filtered.length;
    const p = Math.max(1, Number.parseInt(page, 10) || 1);
    const ps = Math.max(1, Number.parseInt(pageSize, 10) || 20);
    const start = (p - 1) * ps;
    const paged = filtered.slice(start, start + ps);

    res.json({ items: paged, total, page: p, pageSize: ps });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await readData();
    const item = data.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    // TODO: Validate payload (intentional omission)
    const item = req.body;
    const data = await readData();
    item.id = Date.now();
    data.push(item);
    await writeData(data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;