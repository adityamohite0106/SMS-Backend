const Student = require('../models/Student');
const PDFGenerator = require('../utils/pdfGenerator');

// Get all students
exports.getAllStudents = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', course = '' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }
    if (course) {
      query.course = { $regex: course, $options: 'i' };
    }

    const students = await Student.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(query);

    res.json({
      students,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    next(error);
  }
};

// Get student by ID
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
};

// Create new student
exports.createStudent = async (req, res, next) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) {
      error.message = 'Student with this email already exists';
      error.statusCode = 400;
    }
    next(error);
  }
};

// Update student
exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    if (error.code === 11000) {
      error.message = 'Student with this email already exists';
      error.statusCode = 400;
    }
    next(error);
  }
};

// Delete student
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Generate admission form PDF
exports.generateAdmissionForm = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const pdfBuffer = await PDFGenerator.generateAdmissionForm(student);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=admission-form-${student.studentId}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
