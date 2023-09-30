const express = require('express');
var app = express();
var port = 3000;
var router1 = express.Router();

router1.get('/', (req, res) => {
    res.json('router 1 user')
})

app.get('/', (req, res) => {
    res.json('PhatNMTTT')
})

app.use('/api1/', router1)


app.listen(port, () => {
    console.log('Server started on port ${port}')
})