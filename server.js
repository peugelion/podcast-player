const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');

// dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello Jovica');
});

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
})