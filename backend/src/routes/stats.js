const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const DATA_PATH = process.env.DATA_PATH || path.join(__dirname, '../../../data/items.json');
// Tiny in memory cache
let cache = null;
let cacheMtimeMs = 0;

// GET /api/stats
router.get('/', async (req, res, next) => {
  try {
    const stat = await fs.stat(DATA_PATH);
    
    // Serve cached result if file unchanged
    if (cache && cacheMtimeMs === stat.mtimeMs) {
      return res.json(cache);
    }

    const raw = await fs.readFile(DATA_PATH, 'utf-8');
    let items = [];
    try {
      items = JSON.parse(raw || '[]');
    } catch (e) {
      return next(e);
    }

    const prices = items
      .map(i => Number(i.price))
      .filter(n => Number.isFinite(n));

    const total = items.length;
    const averagePrice = prices.length
      ? prices.reduce((a, b) => a + b, 0) / prices.length
      : 0;

    cache = { total, averagePrice };
    cacheMtimeMs = stat.mtimeMs;
    res.json(cache);
  } catch (err) {
    next(err);
  }
});

module.exports = router;