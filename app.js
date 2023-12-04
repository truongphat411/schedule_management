const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const db = require('./src/config/db.config');
const util = require('util');
var nodemailer = require('nodemailer');

const fs = require("fs");
const path = require("path");
const axios = require('axios');

const multer = require('multer');
// Set up multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const xlsx = require('xlsx');

var convertapi = require('convertapi')('RZHyMEPFNDpPBUUS', {conversionTimeout: 60});

const authRoute = require('./src/routes/auth.route');
const courseRoute = require('./src/routes/course.route');
const instructorsRoute = require('./src/routes/instructor.route');
const roomRoute = require('./src/routes/room.route');
const areaRoute = require('./src/routes/area.route');
const kindOfRoomRoute = require('./src/routes/kind_of_room.route');
const departmentRoute = require('./src/routes/department.route');
const classRoute = require('./src/routes/class.route');
const semesterRoute = require('./src/routes/semester.route');

const { httpLogStream } = require('./src/utils/logger');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(morgan('combined', { stream: httpLogStream }));
app.use(cors());

app.use('/api/auth', authRoute);
app.use('/api/', courseRoute);
app.use('/api/', instructorsRoute);
app.use('/api/', roomRoute);
app.use('/api/', areaRoute);
app.use('/api/', kindOfRoomRoute);
app.use('/api/', departmentRoute);
app.use('/api/', classRoute);
app.use('/api/', semesterRoute);

app.get('/', (req, res) => {
    res.status(200).send({
        status: "success",
        data: {
            message: "API working fine"
        }
    });
});


app.get('/api/generate-docx', async (req, res) => {

    try {

    const department_id  = req.query.department_id;

    const semester_id = req.query.semester_id;

    // Extract the raw value of the "ids" query parameter
    const rawIds = req.query.ids;

    // Remove square brackets from the string (if they exist)
    const cleanedIds = rawIds.replace(/\[|\]/g, '');

    // Split the cleaned string into an array of integers
    const ids = cleanedIds.split(',').map(Number);


    for (let i = 0; i < ids.length; i++){

        const content = fs.readFileSync(
            path.resolve("src/uploads", "thumoigiang.docx"),
            "binary"
        );
    
        const zip = new PizZip(content);
    
        const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        });
    
        const data = await util.promisify(db.query).call(db, `
        SELECT
        cl.id,
          c.course_name,
          c.credits,
          i.instructor_name,
          r.room_name,
          mt.time_start,
          mt.daysOfTheWeek,
          d.department_name,
          i.email,
          gr.group_name,
          gr.numberOfStudents
        FROM
            class cl
        JOIN course c ON cl.course_id = c.id
        JOIN instructor i ON cl.instructor_id = i.id
        JOIN semester s ON c.semester_id = s.id
        JOIN department d ON cl.department_id = d.id
        JOIN meeting_time mt ON cl.meeting_time_id = mt.id
        JOIN room r ON cl.room_id = r.id
        JOIN group_students gr ON gr.id = cl.group_students_id
        WHERE i.id = ?
        `,ids[i]);
        var stt = 0;
    
        const classes = [];

        var date = '';
        
        if(semester_id === 1) {
          date = '21/8/2023 - 29/10/2023'
        } else if (semester_id === 2) {
          date = '13/11/2023 - 08/01/2023'
        } else if (semester_id === 3) {
          date = '21/01/2023 - 04/03/2024'
        } else {
          date = '24/03/2023 - 05/05/2023'
        }

    for (let i = 0; i < data.length; i++) {
        const cl = data[i];
        ++stt;
        classes.push({
            stt: stt,
            id: cl.id,
            course_name: cl.course_name,
            instructor_name: cl.instructor_name,
            room_name: cl.room_name,
            credits: cl.credits,
            email: cl.email,
            group_name: cl.group_name,
            numberOfStudents: cl.numberOfStudents,
            time_start: cl.time_start,
            daysOfTheWeek: cl.daysOfTheWeek,
            numberOfPeriods: 3,
            date: date
        });
    }

        var instructor_name = classes[0].instructor_name;
        var email = classes[0].email;
    
        const dataClass = { classes , instructor_name: instructor_name};
        
    
        doc.render(dataClass);
    
        const buf = doc.getZip().generate({
        type: "nodebuffer",
        compression: "DEFLATE",
        });

        fs.writeFileSync(path.resolve("src/uploads", "output.docx"), buf);

        const pdfBuffer = await convertToPdf("src/uploads/output.docx");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        await sendEmailWithAttachment(email, instructor_name, pdfBuffer);

      }
        res.status(200).send({
        message: 'Emails sent successfully'
        });
        } catch (error) {
          console.error('An error occurred:', error);
          res.status(500).send({
              status: 'error',
              message: 'Internal server error',
          });
}
});

const convertToPdf = async (docxPath) => {
  try {
      const pdfResult = await convertapi.convert('pdf', {
          File: docxPath,
      });

      if (!pdfResult.files || pdfResult.files.length === 0) {
          throw new Error('No PDF files were generated.');
      }

      const pdfFile = pdfResult.files[0];
      const response = await axios.get(pdfFile.url, { responseType: 'arraybuffer' });
      return Buffer.from(response.data);
  } catch (error) {
      console.error('PDF conversion failed:', error);
      throw error;
  }
};

const sendEmailWithAttachment = async (email, instructor_name, pdfBuffer) => {
  try {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nguyenmaitruongphat@gmail.com',
        pass: 'kirc uswj lhrm sopo'
      }
    });
    
    var mailOptions = {
      from: 'nguyenmaitruongphat@gmail.com',
      to: email,
      subject: 'Thư mời giảng',
      text: 'Nhà trường xin phép gửi thư mời giảng đến giảng viên: ' + instructor_name,
      attachments: [
          {
            filename: 'thumoigiang.pdf',
            //path: 'src/uploads/output.pdf',
            content: pdfBuffer.toString('base64'),
            encoding: 'base64',
            contentType: 'application/pdf'
          },
        ],
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
  }
};

// Handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
      // Access the uploaded file buffer
      const fileBuffer = req.
      file.buffer;

      // Parse the Excel file
      const workbook = xlsx.read(fileBuffer, { type: 'buffer' });

      // Assuming there is only one sheet, you can access it like this
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet to a JSON object
      const jsonData = xlsx.utils.sheet_to_json(sheet);

      var data = [];

      for (let index = 0; index < jsonData.length; index++) {
        const item = jsonData[index];

        const course = await util.promisify(db.query).call(db, `
        SELECT * FROM course WHERE id = ?
        `,item["Mã MH"]);

        const group_students = await util.promisify(db.query).call(db, `
        SELECT * FROM group_students WHERE group_name = ?
        `,item["Tên lớp"]);

        const meeting_time = await util.promisify(db.query).call(db, `
        SELECT * FROM meeting_time WHERE daysOfTheWeek = ? AND time_start = ?
        `,[item["Thứ"],item["Tiết bắt đầu"]]);

        const room = await util.promisify(db.query).call(db, `
        SELECT * FROM room WHERE room_name = ?
        `,item["Phòng"]);

        const instructor = await util.promisify(db.query).call(db, `
        SELECT * FROM instructor WHERE instructor_name = ?
        `,item["Tên giảng viên"]);

        const semester = await util.promisify(db.query).call(db, `
        SELECT * FROM semester WHERE semester_name = ?
        `,item["Học kì"]);

        const department = await util.promisify(db.query).call(db, `
        SELECT * FROM department WHERE department_name = ?
        `,item["Khoa"]);

        data.push({
          course: course,
          group_students: group_students,
          meeting_time: meeting_time,
          room: room,
          instructor: instructor,
          semester: semester,
          department: department
        });
      }

      const isCheck = await checkConflictTimeTable(data);

      if(!isCheck){
        data = [];
      }

      res.status(200).send({
        status: 'success',
        data
        });
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
  }
});

const checkConflictTimeTable = async (data) => {
  for(let i = 0; i < data.length; i++) {
    for(let j = i + 1; j <= data.length; j++) {
      const x = data[i];
      const y = data[j];
        if(x.meeting_time[0].daysOfTheWeek === y.meeting_time[0].daysOfTheWeek &&
           x.meeting_time[0].sessionsDuringTheDay === y.meeting_time[0].sessionsDuringTheDay &&
            x.meeting_time[0].time === y.meeting_time[0].time) {
              if(x.room[0].room_name === y.room[0].room_name) {
                return false;
              }
              if(x.instructor[0].instructor_name === y.instructor[0].instructor_name) {
                return false;
              }
            }
        if (x.instructor[0].instructor_name === y.instructor[0].instructor_name) {
          if(x.room[0].area_id !== y.room[0].area_id) {
            return false;
          }
          if(x.meeting_time[0].daysOfTheWeek === y.meeting_time[0].daysOfTheWeek) {
            if(x.meeting_time[0].sessionsDuringTheDay !== y.meeting_time[0].sessionsDuringTheDay) {
              return false;
            }
          }
        }
      return true;
    }
  }
}


app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send({
        status: "error",
        message: err.message
    });
    next();
});

module.exports = app;