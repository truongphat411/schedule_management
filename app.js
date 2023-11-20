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

    // Extract the raw value of the "ids" query parameter
    const rawIds = req.query.ids;

    // Remove square brackets from the string (if they exist)
    const cleanedIds = rawIds.replace(/\[|\]/g, '');

    // Split the cleaned string into an array of integers
    const ids = cleanedIds.split(',').map(Number);


    console.log('PhatNMT', ids);
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
          c.maxNumberOfStudents,
          i.instructor_name,
          r.room_name,
          mt.time,
          d.department_name,
          i.email
        FROM
            class cl
        JOIN course c ON cl.course_id = c.id
        JOIN instructor i ON cl.instructor_id = i.id
        JOIN semester s ON c.semester_id = s.id
        JOIN department d ON cl.department_id = d.id
        JOIN meeting_time mt ON cl.meeting_time_id = mt.id
        JOIN room r ON cl.room_id = r.id
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
            maxNumberOfStudents: cl.maxNumberOfStudents,
            email: cl.email
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
                  filename: 'thumoigiang.docx',
                  content: buf,
                },
              ],
          };
    
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              res.status(401).send({
                message: error.message
              });
            } else {
              console.log('Email sent: ' + info.response);
              res.status(200).send({
                message: info.messageId
              })
            }
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