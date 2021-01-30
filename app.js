const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const makeHttpRequest = require('./src/httpRequest')
const { validationController } = require('./src/controller')
const { info } = require('./src/info')

const app = express()

app.use(cors());


const port = process.env.PORT || 8000

app.set('port', port)


// parse application/json
app.use(express.json())

app.use((err, req, res, next) => {
    // ⚙️ our function to catch errors from express-parser
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        res.status(400).send({
            message: "Invalid JSON payload passed.",
            status: "error",
            data: null
        });
    } else next();
  });

app.get('/', cors(), (req, res) => {
    res.status(200).send(info)
})
app.post('/validate-rule', cors(), makeHttpRequest(validationController))

app.use('/*', (req, res) => {
    res.send('There is no page here')
})


module.exports = app

