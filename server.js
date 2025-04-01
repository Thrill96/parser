const express = require('express');
const Mercury = require('./dist/mercury'); // compiled Mercury parser
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/parser', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing URL param' });
  }

  try {
    const result = await Mercury.parse(url);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Parsing failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Mercury Parser API is live at http://localhost:${PORT}`);
});
