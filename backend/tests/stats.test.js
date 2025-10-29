// const request = require('supertest');
// const fs = require('fs').promises;
// const path = require('path');
// const app = require('../src/index');

// const DATA_PATH = path.join(__dirname, '../../data/items.json');

// async function writeData(items) {
//   await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
//   await fs.writeFile(DATA_PATH, JSON.stringify(items, null, 2), 'utf-8');
// }

// describe('Stats API', () => {
//   beforeEach(async () => {
//     await writeData([
//       { id: 1, name: 'Apple',  price: 1 },
//       { id: 2, name: 'Banana', price: 3 }
//     ]);
//   });

//   test('GET /api/stats returns total and averagePrice (cached)', async () => {
//     const r1 = await request(app).get('/api/stats');
//     expect(r1.status).toBe(200);
//     expect(r1.body).toEqual({ total: 2, averagePrice: 2 }); // (1+3)/2

//     const r2 = await request(app).get('/api/stats');
//     expect(r2.status).toBe(200);
//     expect(r2.body.averagePrice).toBe(2);
//   });
// });




const fs = require('fs').promises;
const path = require('path');

// use a different temp data file for this suite
const TEST_DATA_PATH = path.join(__dirname, '../.tmp/stats.test.json');
process.env.DATA_PATH = TEST_DATA_PATH;

const app = require('../src/index'); // require AFTER setting DATA_PATH
const request = require('supertest');

async function writeData(items) {
  await fs.mkdir(path.dirname(TEST_DATA_PATH), { recursive: true });
  await fs.writeFile(TEST_DATA_PATH, JSON.stringify(items, null, 2), 'utf-8');
}

describe('Stats API', () => {
  beforeEach(async () => {
    await writeData([
      { id: 1, name: 'Apple',  price: 1 },
      { id: 2, name: 'Banana', price: 3 }
    ]);
  });

  test('GET /api/stats returns total and averagePrice (cached)', async () => {
    const r1 = await request(app).get('/api/stats');
    expect(r1.status).toBe(200);
    expect(r1.body).toEqual({ total: 2, averagePrice: 2 }); // (1+3)/2

    // Second call should use cache but return same numbers
    const r2 = await request(app).get('/api/stats');
    expect(r2.status).toBe(200);
    expect(r2.body.averagePrice).toBe(2);
  });
});
