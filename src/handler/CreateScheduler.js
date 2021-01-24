const RESTResponse = require("../rest/response/RESTResponse");
const error_code = require("../utils/error_code");
const { application } = require("../utils/logger");
const MagicCount = require("../utils/MagicCount");

module.exports = class CreateScheduler {

    constructor(cron_pattern, magicStr, relativeDir) {
        this.cron_pattern = cron_pattern;
        this.magicStr = magicStr;
        this.relativeDir = relativeDir;
    }

    create() {

        return new Promise( async (resolve, reject) => {
            
            try {

                let cron_pattern = this.cron_pattern;
                let magicStr = this.magicStr;
                let relativeDir = this.relativeDir;

                if(!cron_pattern) {
                    reject(new RESTResponse(error_code.CRON_PATTERN_MISSING, "cron pattern required to create job"));
                    return;
                }

                if(!magicStr) {
                    reject(new RESTResponse(error_code.MAGIC_STRING_NULL, "magic string is null"));
                    return;
                }

                if(!relativeDir) {
                    reject(new RESTResponse(error_code.DIRECTORY_NOT_VALID, "relative dir is null"));
                    return;
                }
                
                let dataHandler = require("../data_layer/MysqlHandler");
                let result = await dataHandler.executeQuery(`
                    insert into task(created_time, cron_pattern, magic_string, directory) Values(?, ?, ?, ?)`, 
                    [Date.now(), cron_pattern, magicStr, relativeDir]
                );
                
                if(result && result.affectedRows > 0) {
                    
                    var CronJob = require('cron').CronJob;

                    var job = new CronJob(cron_pattern, () => {

                        let magicCount = new MagicCount(relativeDir, CONFIG.getThreadCount(), magicStr);
                        magicCount.init();

                    }, null, true, 'America/Los_Angeles');

                    job.start();
                } 

                resolve(new RESTResponse(error_code.SUCCESS, "Jobs created successfully"));
            }
            catch(e) {
                reject(new RESTResponse(error_code.GENERAL_ERROR, "General error"));
                application.severe("Exception occurred at CreateScheduler.create() :: " + e);
            }
        });
    }
}