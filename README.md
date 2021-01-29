# directory_watcher
Scheduler# Directory watcher

List of layers:

1. REST API params pattern checker
2. API throatling
3. Database layer
4. logger
5. Scheduler

# Rest API Params pattern checker
```/src/rest/security/*``` folder contains list of json files through which we can configured Rest API structure.
ie. How the Query params will look like. What is the data type of that query params. Whether the query params is mandatory or not. etc... 
Once the service receives the request, it will check against this json format. if it satisfy, the service will allow the request. If not, it will reject it.
For addition of new Rest API, we need to add the configuration in the appropriate .json file.

# API throatling
This module used express-rate-limiter npm module to throatle the Rest API.
Currently, the service will allow maximum of 100 request/30 min for all API.
If needed, we can configure to make changes.

# Database layer
This service uses MYSQL as database layer. This layer contains following table.
1. task -> Maintain list of task with status information.
2. task_occurance -> All the occurance of task through scheduler
3. directory_content -> Maintain each directory state.

All the above tables are horizontally partitioned using mysql range partition. Every partition will contain 1 million records. Creation of these schema during initial service creation will be taken care by ```services/DirWatcher.js```

# logger
This service uses two types of log.
1. Access log => Log about all request initiated to the server. Stored in ```logs/access.log```
2. Application log => Log about application run. Stored in ```logs/application.log```

# Scheduler
This service uses cron npm module to schedule a job. A job can be scheduled through rest api.
Refer below section to know more about Rest api.

# REST APIs
```1. **GET :: /api/v1/job/info?id=<job_id>** => Give state of a job```
```2. **DELETE :: /api/v1/job/delete?id=<job_id>** => Delete a job```
```3. **POST :: /api/v1/job/create?cron_patter=<pattern>&magic_string=<string>&directory=<directory>** => Create a schedule ``` jobs with configured thread count to watch directory
