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
const Data = require("./src/data.js");

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
const groupStudentsRoute = require('./src/routes/group_students.route');
const meetingTimeRoute = require('./src/routes/meeting_time.route');
const statusMailRoute = require('./src/routes/status_mail.route');

const { httpLogStream } = require('./src/utils/logger');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(morgan('combined', { stream: httpLogStream }));
app.use(cors());

app.use('/api/', authRoute);
app.use('/api/', courseRoute);
app.use('/api/', instructorsRoute);
app.use('/api/', roomRoute);
app.use('/api/', areaRoute);
app.use('/api/', kindOfRoomRoute);
app.use('/api/', departmentRoute);
app.use('/api/', classRoute);
app.use('/api/', semesterRoute);
app.use('/api/', statusMailRoute);
app.use('/api/', groupStudentsRoute);
app.use('/api/', meetingTimeRoute);


app.options("/*", function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
});

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});


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
          gr.numberOfStudents,
          cl.number_of_periods,
          cl.study_time
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
            numberOfPeriods: cl.number_of_periods,
            study_time: cl.study_time
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

        const status = await util.promisify(db.query).call(db,`
          SELECT * FROM status_mail 
          WHERE semester_id = ? AND 
          instructor_id = ?`,[semester_id, ids[i]]);
        if (status.length === 0) {
          await util.promisify(db.query).call(db,"INSERT INTO status_mail SET ?",{
            message: 'đã gửi',
            instructor_id: ids[i],
            semester_id: semester_id
          });
        }
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
app.post('/api/upload', upload.single('file'), async (req, res) => {
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
      const jsonData = xlsx.utils.sheet_to_json(sheet, {
        header: 0,
        defval: ""
      });

      var data = [];

      for (let index = 0; index < jsonData.length; index++) {
        const item = jsonData[index];

        var course = [];
        var group_students = [];
        var meeting_time = [];
        var room = [];
        var instructor = [];
        var semester = [];
        var department = [];

        if(item["Mã MH"] !== '') {
            course = await util.promisify(db.query).call(db, `
            SELECT * FROM course WHERE id = ?
            `,item["Mã MH"]);
        }

        if(item["Tên lớp"] !== '') {
            group_students = await util.promisify(db.query).call(db, `
            SELECT * FROM group_students WHERE group_name = ?
            `,item["Tên lớp"]);
        }

        if(item["Thứ"] !== '' && item["Tiết bắt đầu"] !== '') {
            meeting_time = await util.promisify(db.query).call(db, `
            SELECT * FROM meeting_time WHERE days_of_the_week = ? AND time_start = ?
            `,[item["Thứ"],item["Tiết bắt đầu"]]);         
        }
        
        if(item["Phòng"] !== '') {
            room = await util.promisify(db.query).call(db, `
            SELECT * FROM room WHERE room_name = ?
            `,item["Phòng"]);
        }

        if(item["Tên giảng viên"] !== '') {
            instructor = await util.promisify(db.query).call(db, `
            SELECT * FROM instructor WHERE instructor_name = ?
            `,item["Tên giảng viên"]);          
        }

        if(item["Học kì"] !== '') {
            semester = await util.promisify(db.query).call(db, `
            SELECT * FROM semester WHERE semester_name = ?
            `,item["Học kì"]);              
        }

        if(item["Khoa"] !== '') {
            department = await util.promisify(db.query).call(db, `
            SELECT * FROM department WHERE department_name = ?
            `,item["Khoa"]);              
        }

        

        data.push({
          course: course[0],
          group_students: group_students[0],
          meeting_time: meeting_time[0],
          room: room[0],
          instructor: instructor[0],
          semester: semester[0],
          department: department[0],
          numberOfPeriods: item["Số tiết"],
          date: item["Ngày học"]
        });
      }

    //   const isCheck = await checkConstraints(data);

    //   if(!isCheck){
    //     data = [];
    //   }
      res.status(200).send({
        status: 'success',
        data
        });
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
  }
});

const checkConstraints = async (data) => {
  for(let i = 0; i < data.length; i++) {
    for(let j = i + 1; j <= data.length; j++) {
      const x = data[i];
      const y = data[j];
        if(x.semester[0].semester_name !== y.semester[0].semester_name ||
          x.department[0].department_name !== y.department[0].department_name) {
          return false;
        }
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
          if(x.meeting_time[0].daysOfTheWeek === y.meeting_time[0].daysOfTheWeek) {
            if(x.room[0].area_id !== y.room[0].area_id) {
              return false;
            }
          }
        }
      return true;
    }
  }
}

app.post('/api/save-classes',upload.single('file'), async (req, res) => {
  try {
    // const classes = req.body;

    // for (let index = 0; index < classes.length; index++) {
    //   const item = classes[index];
    //   var instructor;

    //   const course = await util.promisify(db.query).call(db, `
    //   SELECT * FROM course WHERE id = ?
    //   `,item.course.id);

    //   const group_students = await util.promisify(db.query).call(db, `
    //   SELECT * FROM group_students WHERE group_name = ?
    //   `,item.group_students.group_name);

    //   const meeting_time = await util.promisify(db.query).call(db, `
    //   SELECT * FROM meeting_time WHERE daysOfTheWeek = ? AND time_start = ?
    //   `,[item.meeting_time.daysOfTheWeek,item.meeting_time.time_start]);

    //   const room = await util.promisify(db.query).call(db, `
    //   SELECT * FROM room WHERE room_name = ?
    //   `,item.room.room_name);

    //   if(item.instructor.instructor_name !== null || item.instructor.instructor_name != '') {
    //     instructor = await util.promisify(db.query).call(db, `
    //     SELECT * FROM instructor WHERE instructor_name = ?
    //     `,item.instructor.instructor_name);
    //   }
      
    //   const semester = await util.promisify(db.query).call(db, `
    //   SELECT * FROM semester WHERE semester_name = ?
    //   `,item.semester.semester_name);

    //   const department = await util.promisify(db.query).call(db, `
    //   SELECT * FROM department WHERE department_name = ?
    //   `,item.department.department_name);

    //   const date = item.date;
    //   const numberOfPeriods = item.numberOfPeriods;

    //   await util.promisify(db.query).call(db,"INSERT INTO class SET ?",{
    //     course_id: course.id,
    //     instructor_id: instructor !== null ? instructor.id : null,
    //     room_id: room.id,
    //     meeting_time_id: meeting_time.id,
    //     department_id: department.id,
    //     group_students_id: group_students.id,
    //     semester_id: semester.id,
    //     study_time: date,
    //     number_of_periods: numberOfPeriods
    //   });
    // }
    // Access the uploaded file buffer
    const fileBuffer = req.file.buffer;

    // Parse the Excel file
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });

    // Assuming there is only one sheet, you can access it like this
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to a JSON object
    const jsonData = xlsx.utils.sheet_to_json(sheet, {
      header: 0,
      defval: ""
    });


    for (let index = 0; index < jsonData.length; index++) {
      const item = jsonData[index];

      var course = [];
      var group_students = [];
      var meeting_time = [];
      var room = [];
      var instructor = [];
      var semester = [];
      var department = [];

      if(item["Mã MH"] !== '') {
          course = await util.promisify(db.query).call(db, `
          SELECT * FROM course WHERE id = ?
          `,item["Mã MH"]);
      }

      if(item["Tên lớp"] !== '') {
          group_students = await util.promisify(db.query).call(db, `
          SELECT * FROM group_students WHERE group_name = ?
          `,item["Tên lớp"]);
      }

      if(item["Thứ"] !== '' && item["Tiết bắt đầu"] !== '') {
          meeting_time = await util.promisify(db.query).call(db, `
          SELECT * FROM meeting_time WHERE days_of_the_week = ? AND time_start = ?
          `,[item["Thứ"],item["Tiết bắt đầu"]]);         
      }
      
      if(item["Phòng"] !== '') {
          room = await util.promisify(db.query).call(db, `
          SELECT * FROM room WHERE room_name = ?
          `,item["Phòng"]);
      }

      if(item["Tên giảng viên"] !== '') {
          instructor = await util.promisify(db.query).call(db, `
          SELECT * FROM instructor WHERE instructor_name = ?
          `,item["Tên giảng viên"]);          
      }

      if(item["Học kì"] !== '') {
          semester = await util.promisify(db.query).call(db, `
          SELECT * FROM semester WHERE semester_name = ?
          `,item["Học kì"]);              
      }

      if(item["Khoa"] !== '') {
          department = await util.promisify(db.query).call(db, `
          SELECT * FROM department WHERE department_name = ?
          `,item["Khoa"]);              
      }

      if(item["Tên giảng viên"] === '' || item["Tên giảng viên"] === null) {
        instructor = null;
      }

        await util.promisify(db.query).call(db,"INSERT INTO class SET ?",{
        id: null,
        course_id: course[0].id,
        instructor_id: instructor !== null ? instructor[0].id : null,
        room_id: room[0].id,
        meeting_time_id: meeting_time[0].id,
        department_id: department[0].id,
        group_students_id: group_students[0].id,
        semester_id: semester[0].id,
        date: item["Ngày học"],
        number_of_periods: parseInt(item["Số tiết"]) 
      });
    }

    res.status(200).send({
      status: 'success'
    });
  } catch(error) {
    console.error('Error saving classes:', error);
    res.status(500).send({
      status: 'error',
      message: 'Internal Server Error'
    });
  }
});

app.get('/api/send-to-department', async (req, res) => {

    try {

    const sender_id  = req.query.sender_id;
    
    // Extract the raw value of the "ids" query parameter
    const rawIds = req.query.ids;

    // Remove square brackets from the string (if they exist)
    const cleanedIds = rawIds.replace(/\[|\]/g, '');

    // Split the cleaned string into an array of integers
    const ids = cleanedIds.split(',').map(Number);


    for (let i = 0; i < ids.length; i++){
        const classes = await util.promisify(db.query).call(db, `
          SELECT * FROM class WHERE department_id = ?
          `,i);
          for(let j = 0; j < classes;i++) {
            const now = new Date();
            await util.promisify(db.query).call(db,"INSERT INTO task_timetable SET ?",{
                id: null,
                sender_id: sender_id,
                receiver_id: receiver_id,
                class_id: i,
                description: '',
                status: now,
                created_on: now
              });
          }
      }
        res.status(200).send({
        message: 'success'
        });
        } catch (error) {
          console.error('An error occurred:', error);
          res.status(500).send({
              status: 'error',
              message: 'Internal server error',
          });
}
});


app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send({
        status: "error",
        message: err.message
    });
    next();
});

module.exports = app;