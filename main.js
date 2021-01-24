const express = require('express')
const app = express();
const port = 8000;

const { request } = require('http');
const { response } = require('express');

const CONFIG = require("./Config");

const MagicCount = require('./src/utils/MagicCount');
const DirWatcher = require('./services/DirWatcher');
const access = require("./src/utils/logger").access;

require('./src/rest/routes/schedulerAction')(app);

app.use(function (request, response, next) {
  access.info(request.originalUrl);
  next();
});

/* ---
src/rest/scheduler
start -> start, update
delete -> delete
info -> Information

task
1. ID
2. created_time
3. cron_pattern

task_occurance
1. ID
2. start_time
3. end_time
4. file added
5. file deleted
6. magic_count
7. status
8. cron_pattern
--- */

app.listen(port, () => {

  console.log(`Server start at ${port}!`);

  initializeService();
});

function initializeService() {

   new DirWatcher().startService();
}

