const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('<h1>Notes MERN API</h1><p>Server is running.</p>');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
