import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { validateExcelFile } from './utils/excelValidator.js';
import { Record } from './models/Record.js';
import { fileURLToPath } from 'url';
import path from 'path';
import { dirname } from 'path';

// Add these lines to define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const upload = multer({ limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB limit

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const sheets = validateExcelFile(req.file.buffer);
    res.json({ sheets });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to process file' });
  }
});

app.post('/api/import', async (req, res) => {
  try {
    const { sheets } = req.body;
    
    // Import only valid rows
    const records = sheets.flatMap(sheet => 
      sheet.data.map(row => ({
        ...row,
        sheetName: sheet.name
      }))
    );

    await Record.insertMany(records);
    
    res.json({ message: 'Data imported successfully' });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ message: 'Failed to import data' });
  }
});

app.delete('/api/rows/:id', async (req, res) => {
  try {
    await Record.findByIdAndDelete(req.params.id);
    res.json({ message: 'Row deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Failed to delete row' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});