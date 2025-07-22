const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');


router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Students API is running' 
  });
});

router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);
router.post('/:id/generate-admission-form', studentController.generateAdmissionForm);

module.exports = router;
