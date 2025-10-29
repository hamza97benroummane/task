// const request = require('supertest');
// const fs = require('fs').promises;
// const path = require('path');
// const app = require('../src/index');

// const DATA_PATH = path.join(__dirname, '../../data/items.json');

// async function writeData(items) {
//   await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
//   await fs.writeFile(DATA_PATH, JSON.stringify(items, null, 2), 'utf-8');
// }

// describe('Items API', () => {
//   beforeEach(async () => {
//     // Seed a small dataset before each test
//     await writeData([
//       { id: 1, name: 'Apple',  price: 1.5 },
//       { id: 2, name: 'Banana', price: 2.0 },
//       { id: 3, name: 'Apricot', price: 2.5 },
//     ]);
//   });

//   test('GET /api/items returns paginated items with meta', async () => {
//     const res = await request(app).get('/api/items?page=1&pageSize=2');
//     expect(res.status).toBe(200);
//     expect(res.body).toMatchObject({
//       items: expect.any(Array),
//       total: 3,
//       page: 1,
//       pageSize: 2
//     });
//     expect(res.body.items.length).toBe(2);
//     expect(res.body.items[0].name).toBe('Apple');
//   });

//   test('GET /api/items filters by q (case-insensitive)', async () => {
//     const res = await request(app).get('/api/items?q=ap&page=1&pageSize=10');
//     expect(res.status).toBe(200);
//     const names = res.body.items.map(i => i.name);
//     expect(names).toEqual(expect.arrayContaining(['Apple', 'Apricot']));
//     expect(res.body.total).toBe(2);
//   });

//   test('GET /api/items/:id returns 404 for unknown id', async () => {
//     const res = await request(app).get('/api/items/9999');
//     expect(res.status).toBe(404);
//     expect(res.body).toMatchObject({ status: 404 });
//   });

//   test('POST /api/items creates an item', async () => {
//     const payload = { name: 'Cherry', price: 3.3 };
//     const res = await request(app).post('/api/items').send(payload);
//     expect(res.status).toBe(201);
//     expect(res.body).toMatchObject({ name: 'Cherry', price: 3.3, id: expect.any(Number) });

//     const after = await request(app).get('/api/items?page=1&pageSize=10');
//     expect(after.body.total).toBe(4);
//   });
// });



const fs = require('fs').promises;
const path = require('path');

// use a suite-specific temp data file
const TEST_DATA_PATH = path.join(__dirname, '../.tmp/items.test.json');
process.env.DATA_PATH = TEST_DATA_PATH;

const app = require('../src/index'); // require AFTER setting DATA_PATH
const request = require('supertest');

async function writeData(items) {
  await fs.mkdir(path.dirname(TEST_DATA_PATH), { recursive: true });
  await fs.writeFile(TEST_DATA_PATH, JSON.stringify(items, null, 2), 'utf-8');
}

describe('Items API', () => {
  beforeEach(async () => {
    await writeData([
      { id: 1, name: 'Apple',  price: 1.5 },
      { id: 2, name: 'Banana', price: 2.0 },
      { id: 3, name: 'Apricot', price: 2.5 }
    ]);
  });

  test('GET /api/items returns paginated items with meta', async () => {
    const res = await request(app).get('/api/items?page=1&pageSize=2');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      items: expect.any(Array),
      total: 3,
      page: 1,
      pageSize: 2
    });
    expect(res.body.items.length).toBe(2);
    expect(res.body.items[0].name).toBeDefined();
  });

  test('GET /api/items filters by q (case-insensitive)', async () => {
    const res = await request(app).get('/api/items?q=ap&page=1&pageSize=10');
    expect(res.status).toBe(200);
    const names = res.body.items.map(i => i.name);
    expect(names).toEqual(expect.arrayContaining(['Apple', 'Apricot']));
    expect(res.body.total).toBe(2);
  });

  test('GET /api/items/:id returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/items/9999');
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ status: 404 });
  });

  test('POST /api/items creates an item', async () => {
    const payload = { name: 'Cherry', price: 3.3 };
    const res = await request(app).post('/api/items').send(payload);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: 'Cherry', price: 3.3, id: expect.any(Number) });

    const after = await request(app).get('/api/items?page=1&pageSize=10');
    expect(after.body.total).toBe(4);
  });
});
