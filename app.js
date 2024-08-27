const express = require('express');
const sql = require('mssql');
const config = require('./dbConfig');

const app = express();
const port = 3000;

app.use(express.json());

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

app.get('/Userdetails', async (req, res) => {
  try {
    const pool = await poolPromise;

    const { userId, classId } = req.query;

    if (!userId || !classId) {
      return res.status(400).json({
        status: false,
        message: 'Both userId and classId parameters are required'
      });
    }

    const query = 'SELECT * FROM Student_detail WHERE id = @userId AND Class = @classId';
    const request = pool.request();

    request.input('userId', sql.Int, parseInt(userId));
    request.input('classId', sql.Int, parseInt(classId));

    const result = await request.query(query);

    if (result.recordset.length === 0) {
      res.json({
        status: false,
        message: 'No data found'
      });
    } else {
      res.json({
        status: true,
        message: 'Data retrieved successfully',
        data: result.recordset
      });
    }
  } catch (err) {
    console.error('SQL error', err);
    res.status(500).json({
      status: false,
      message: 'Error retrieving data'
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
