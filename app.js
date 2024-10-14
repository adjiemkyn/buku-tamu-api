const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Tambahkan ini
const guestBookRoutes = require('./routes/guestBook');
const app = express();
const port = 5000;

// Aktifkan CORS untuk semua permintaan
app.use(cors());

app.use(bodyParser.json());
app.use('/api/guestbook', guestBookRoutes);

app.listen(port, () => {
    console.log(`API berjalan di http://localhost:${port}`);
});
