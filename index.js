require('dotenv').config()
const express = require("express");
const winston = require("winston");
const bodyParser = require('body-parser');
const fs= require('fs');
const rfs = require('rotating-file-stream')
const path=require('path');
const morgan =require('morgan');
const cors = require('cors');
const app = express();
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(cors());
//let requestLogStream = fs.createWriteStream(path.join(__dirname, 'log/requests.log'), { flags: 'w' });
var requestLogStream = rfs.createStream('requests.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
})
//somehow it failed to create file itself
const logger = winston.createLogger({
    transports: [
      new winston.transports.File({ filename: path.join(__dirname, 'log/server.log') })
    ]
  });
app.use(morgan('common', { stream: requestLogStream }));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views',path.join( __dirname+'/view'));
app.use(require("./api/index.js"));
app.set('port',process.env.PORT );
app.listen(app.get('port'));
logger.log({
    level:'info',
    message:'app listening in port '+app.get('port')
});
exports.logger=logger;
