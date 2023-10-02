const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://nguyenmaitruongphat:RpuIRRtBSLjgFnxP@schedule-management.vim5o5e.mongodb.net/',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        
        console.log('Database connect success')

    } catch (err) {
        console.log(err);
    }
}

module.exports = connectDB;