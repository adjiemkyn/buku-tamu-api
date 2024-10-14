const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Path ke file JSON yang menyimpan data buku tamu
const dataFilePath = path.join(__dirname, '../data/guestBookData.json');

// Fungsi untuk membaca data dari file JSON
const readGuestBookData = () => {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
};

// Fungsi untuk menulis data ke file JSON
const writeGuestBookData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Endpoint GET untuk mendapatkan semua tamu
router.get('/', (req, res) => {
    const guestBook = readGuestBookData();
    res.status(200).json(guestBook);
});

// Endpoint POST untuk menambahkan tamu baru
router.post('/', (req, res) => {
    const { name, message } = req.body;

    // Validasi input
    if (!name || !message) {
        return res.status(400).json({ error: 'Nama dan pesan harus diisi.' });
    }

    const guestBook = readGuestBookData();
    const newGuest = { id: Date.now(), name, message };
    guestBook.push(newGuest);
    writeGuestBookData(guestBook);

    res.status(201).json(newGuest);
});

// Endpoint PUT untuk memperbarui tamu berdasarkan ID
router.put('/:id', (req, res) => {
    const guestId = parseInt(req.params.id);
    const { name, message } = req.body;

    const guestBook = readGuestBookData();
    const guestIndex = guestBook.findIndex(guest => guest.id === guestId);

    if (guestIndex === -1) {
        return res.status(404).json({ error: 'Tamu tidak ditemukan.' });
    }

    // Update data tamu
    if (name) guestBook[guestIndex].name = name;
    if (message) guestBook[guestIndex].message = message;

    writeGuestBookData(guestBook);
    res.status(200).json(guestBook[guestIndex]);
});

// Endpoint DELETE untuk menghapus tamu berdasarkan ID
router.delete('/:id', (req, res) => {
    const guestId = parseInt(req.params.id);
    const guestBook = readGuestBookData();
    const updatedGuestBook = guestBook.filter(guest => guest.id !== guestId);

    if (guestBook.length === updatedGuestBook.length) {
        return res.status(404).json({ error: 'Tamu tidak ditemukan.' });
    }

    writeGuestBookData(updatedGuestBook);
    res.status(200).json({ message: 'Tamu berhasil dihapus.' });
});

module.exports = router;
