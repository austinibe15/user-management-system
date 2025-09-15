// test-db.js
const pool = require('./db/db');
(async () => {
  try {
    const [rows] = await pool.execute('SELECT 1');
    console.log('execute exists, result:', rows);
  } catch (e) {
    console.error('DB test error', e);
  }
})();