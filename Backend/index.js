// Bài 1 - Bước 1: Tạo server Express cơ bản + middleware
const express = require('express');
const cors = require('cors');
// Bài 1 - Bước 4: Kết nối MongoDB bằng Mongoose
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Bài 1 - Bước 1: Middleware CORS + parse JSON
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Bài 1 - Bước 1: Route kiểm tra sức khỏe
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Student Management API running' });
});

// Bài 1 - Bước 4: Kết nối MongoDB (local 27017)
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/student_db';
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('Đã kết nối MongoDB thành công');
  })
  .catch((err) => {
    console.error('Lỗi kết nối MongoDB:', err);
  });

// Bài 1 - Bước 5: Đăng ký model Student
require('./Student');
const Student = require('./Student');

// Bài 1 - Bước 6: API GET danh sách học sinh
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bài 2 - Bước 1: API POST thêm học sinh
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Bài 3 - Bước 1: API GET theo ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const stu = await Student.findById(req.params.id);
    if (!stu) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(stu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bài 3 - Bước 1: API PUT cập nhật học sinh theo ID
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStu = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedStu) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(updatedStu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Bài 4 - Bước 1: API DELETE xóa học sinh theo ID
app.delete('/api/students/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Đã xóa học sinh', id: deleted._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
