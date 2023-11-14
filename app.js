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

app.get('/', (req, res) => {
    res.status(200).send({
        status: "success",
        data: {
            message: "API working fine"
        }
    });
});


app.get('/generate-docx', async (req, res) => {
    const content = fs.readFileSync(
        path.resolve("src/uploads", "expected-empty-table.docx"),
        "binary"
    );

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    });

    const classes = await util.promisify(db.query).call(db, `
    SELECT
    	cl.id,
        c.course_name,
        i.instructor_name,
        r.room_name,
        mt.time,
        d.department_name
    FROM
        class cl
    JOIN course c ON cl.course_id = c.id
    JOIN instructor i ON cl.instructor_id = i.id
    JOIN semester s ON c.semester_id = s.id
    JOIN department d ON cl.department_id = d.id
    JOIN meeting_time mt ON cl.meeting_time_id = mt.id
    JOIN room r ON cl.room_id = r.id
    WHERE i.id = 2
    `);

    const data = classes.map(cl => ({
        id: cl.id,
        course_name: cl.course_name,
        instructor_name: cl.instructor_name,
        room_name: cl.room_name,
        time: cl.time, 
        department_name: cl.department_name
    }));

    const dataClass = { classes };
    

    doc.render(dataClass);

    const buf = doc.getZip().generate({
    type: "nodebuffer",
    // compression: DEFLATE adds a compression step.
    // For a 50MB output document, expect 500ms additional CPU time
    compression: "DEFLATE",
    });

    //fs.writeFileSync(path.resolve("src/uploads", "output.docx"), buf);


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'nguyenmaitruongphat@gmail.com',
          pass: 'Phat@123456'
        }
      });
      
      var mailOptions = {
        from: 'nguyenmaitruongphat@gmail.com',
        to: 'phatnmt@ominext.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!',
        attachments: [
            {
              filename: 'output.docx',
              content: buf,
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
  
    const file = `src/uploads/output.docx`;

    // Send a success response or do other processing as needed
    res.download(file);
  });


app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send({
        status: "error",
        message: err.message
    });
    next();
});

module.exports = app;