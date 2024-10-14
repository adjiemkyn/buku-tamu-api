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
    const { name, email, address, message } = req.body;

    // Validasi input di back-end
    if (!name || name.trim().length < 3) {
        return res.status(400).json({ error: 'Nama harus diisi dan minimal 3 karakter.' });
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
        return res.status(400).json({ error: 'Email tidak valid.' });
    }
    if (!address || address.trim().length < 5) {
        return res.status(400).json({ error: 'Alamat harus diisi dan minimal 5 karakter.' });
    }
    if (!message || message.trim().length < 5) {
        return res.status(400).json({ error: 'Pesan harus diisi dan minimal 5 karakter.' });
    }

    const guestBook = readGuestBookData();
    const newGuest = { id: Date.now(), name, email, address, message };
    guestBook.push(newGuest);
    writeGuestBookData(guestBook);

    res.status(201).json(newGuest);
});

// Endpoint PUT untuk memperbarui tamu berdasarkan ID
router.put('/:id', (req, res) => {
    const guestId = parseInt(req.params.id);
    const { name, email, address, message } = req.body;

    const guestBook = readGuestBookData();
    const guestIndex = guestBook.findIndex(guest => guest.id === guestId);

    if (guestIndex === -1) {
        return res.status(404).json({ error: 'Tamu tidak ditemukan.' });
    }

    // Validasi input di back-end
    if (name && name.trim().length < 3) {
        return res.status(400).json({ error: 'Nama harus minimal 3 karakter.' });
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email)) {
        return res.status(400).json({ error: 'Email tidak valid.' });
    }
    if (address && address.trim().length < 5) {
        return res.status(400).json({ error: 'Alamat harus minimal 5 karakter.' });
    }
    if (message && message.trim().length < 5) {
        return res.status(400).json({ error: 'Pesan harus minimal 5 karakter.' });
    }

    // Update data tamu
    if (name) guestBook[guestIndex].name = name;
    if (email) guestBook[guestIndex].email = email;
    if (address) guestBook[guestIndex].address = address;
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