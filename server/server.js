require('./config/config');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.json('Hello World')
});
app.post('/usuario', function(req, res) {
    let body = req.body;
    res.json({
        persona: body
    });
});

app.listen(process.env.PORT, () => {
    console.log("Ecuchando el puerto: ", process.env.PORT);

});