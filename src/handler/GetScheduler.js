const Scheduler = require("../rest/response/Sheduler");
const application = require("../utils/logger").application
const RESTResponse = require("../rest/response/RESTResponse");
const error_code = require("../utils/error_code");

module.exports = class GetScheduler {
    
    getInfo() {

        return new Promise( async (resolve, reject) => {

            try {
                let dataHandler = require("../data_layer/MysqlHandler");
                let taskDetails = await dataHandler.executeQuery("select ID, start_time, end_time, file_added, file_deleted, magic_count, status from task_occurance");
                
                let schedulers = [];

                for(let task in taskDetails) {

                    let eachScheduler = new Scheduler();

                    eachScheduler
                        .setSchedulerId(task.ID)
                        .setStartTime(task.start_time)
                        .setEndTime(task.end_time)
                        .setFileAdded(task.file_added)
                        .setFileDeleted(task.file_deleted)
                        .setMagicCount(task.magic_count)
                        .setStatus(task.status)
                        .setCode(200)
                        .setMessage("Scheduler details fetched successfully");
                    
                    schedulers[i] = eachScheduler;
                }
               
                resolve(schedulers);
            }
            catch(e) {
                application.severe(`Exception occurred in GetScheduler.getInfo() :: ${e}`);
                reject(new RESTResponse(error_code.GENERAL_ERROR, "Failed to fetch scheduler details"));
            }
        });
    }
}