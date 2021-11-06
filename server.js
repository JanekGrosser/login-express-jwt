//Run express server at port 3000
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

//app use cors
app.use(cors(corsOptions));

//parse requset content type application/json
app.use(express.json());

//parse request content type application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//main route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

//listen to port 3000
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});
