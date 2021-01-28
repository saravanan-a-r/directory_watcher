const express = require('express')
const app = express();
const port = 8000;

const { request } = require('http');
const { response } = require('express');

global.CONFIG = require("./Config");

const MagicCount = require('./src/utils/MagicCount');
const DirWatcher = require('./services/DirWatcher');
const access = require("./src/utils/logger").access;

const rateLimit = require("express-rate-limit");
 
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
 
//  apply to all requests
app.use(limiter);

app.use(function (request, response, next) {
  access.info(request.originalUrl);
  if(!security.securityFilter(request)) {
    access.info(`${request.originalUrl} :: url doesn't match the configured security filter`);
  }
  next();
});

app.listen(port, () => {

  console.log(`Server start at ${port}!`);

  initializeService();
});

function initializeService() {

  new DirWatcher().startService();
}

require('./src/rest/routes/schedulerAction')(app);
