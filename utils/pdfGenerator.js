const PDFDocument = require('pdfkit');

class PDFGenerator {
  static async generateAdmissionForm(student) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        doc.fontSize(24).fillColor('#2563eb').text('ADMISSION FORM', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(16).fillColor('#666').text('Student Management System', { align: 'center' });
        doc.moveDown(1);

        // Horizontal line
        doc.strokeColor('#e5e7eb').lineWidth(1)
           .moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(1);

        // Student Information
        doc.fontSize(18).fillColor('#1f2937').text('Student Information', { underline: true });
        doc.moveDown(0.5);

        const infoFields = [
          ['Student ID:', student.studentId],
          ['Full Name:', student.name],
          ['Email Address:', student.email],
          ['Phone Number:', student.phone],
          ['Course:', student.course],
          ['Enrollment Date:', new Date(student.enrollmentDate).toLocaleDateString()],
          ['Address:', student.address]
        ];

        doc.fontSize(12);
        infoFields.forEach(([label, value]) => {
          doc.fillColor('#374151').text(label, 80, doc.y, { width: 150, continued: true })
             .fillColor('#000').text(value, { width: 350 });
          doc.moveDown(0.7);
        });

        doc.moveDown(1);

        // Terms and Conditions
        doc.fontSize(16).fillColor('#1f2937').text('Terms and Conditions', { underline: true });
        doc.moveDown(0.5);

        const terms = [
          '1. The student must maintain a minimum attendance of 75% in all courses.',
          '2. All fees must be paid on time as per the fee structure.',
          '3. The student must follow the institution\'s code of conduct.',
          '4. Any disciplinary action may result in suspension or expulsion.',
          '5. The institution reserves the right to modify rules and regulations.'
        ];

        doc.fontSize(10).fillColor('#4b5563');
        terms.forEach(term => {
          doc.text(term, { width: 500, align: 'justify' });
          doc.moveDown(0.3);
        });

        doc.moveDown(2);

        // Signature Section
        doc.fontSize(12).fillColor('#000');
        doc.text('Student Signature: ____________________', 80, doc.y);
        doc.text('Date: ____________________', 350, doc.y);
        doc.moveDown(2);
        doc.text('Authorized Signature: ____________________', 80, doc.y);
        doc.text('Date: ____________________', 350, doc.y);

        // Footer
        doc.moveDown(3);
        doc.fontSize(8).fillColor('#9ca3af').text(
          `Generated on ${new Date().toLocaleString()} | Student Management System`,
          { align: 'center' }
        );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = PDFGenerator;