const { resolve } = require("path");
const error_code = require("../utils/error_code");
const RESTResponse = require("../rest/response/RESTResponse");
const { application } = require("../utils/logger");

module.exports = class DeleteScheduler {

    constructor(scheduler_ids) {
        this.scheduler_ids = scheduler_ids;
    }

    setSchedulerIds(scheduler_ids) {
        this.scheduler_ids = scheduler_ids;
        return this;
    }

    delete(scheduler_ids) {

        return new Promise( async (resolve, reject) => {
            
            try {
                if(!scheduler_ids) {
                    scheduler_ids = this.scheduler_ids;
                }
                
                if(!scheduler_ids) {
                    reject(new RESTResponse(error_code.SCHEDULER_ID_MISSING, "scheduler_id is missing"));
                    return;
                }

                scheduler_ids = JSON.parse(scheduler_ids);

                let dataHandler = require("../data_layer/MysqlHandler");
                let result = await dataHandler.executeQuery(`delete from task where ID IN (?)`, [scheduler_ids.toString()]);

                resolve(new RESTResponse(error_code.SUCCESS, "Jobs deleted successfully"));
            }
            catch(e) {
                application.severe("Exception occurred at DeleteScheduler.delete() :: " + e);
                reject(new RESTResponse(error_code.GENERAL_ERROR, "General error occur"));
            }
        });
    }
}