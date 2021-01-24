const fs = require("fs");

const application = require("./src/utils/logger").application;

class Config {

    constructor(_configFilePath) {

        this._config = null;
        this._configFilePath = _configFilePath;
        this._populateConfiguration();
    }

    refreshConfigFilePath(_configFilePath) {

        application.info(`Config.refreshConfigFilePath invoked :: ${_configFilePath}`);
        
        try {
            this._configFilePath = _configFilePath;
            this._populateConfiguration();
        }
        catch(e) {
            application.severe(`Exception occurred in Config.refreshConfigFilePath :: ${e}`);
        }

        return this;
    }

    /* --- Private Method. Avoid access it from outside --- */
    _populateConfiguration() {

        application.info(`_populateConfiguration invoked`);

        try {
            let _configFilePath = this._configFilePath;
            
            if(!fs.existsSync(_configFilePath)) {
                throw new Exception("Configuration file doesn't exist");
            }

            this._config = JSON.parse(fs.readFileSync(this._configFilePath));
        }
        catch(e) {
            application.severe(`Exception occurred in Config._populateConfiguration() :: ${e}`);
        }
    }

    getScheduledTime() {

        try {
            if(this._config != null) {
                return this._config.schedule_time;
            }
        }
        catch(e) {
            application.severe(`Exception occurred in Config.getScheduledTime() :: ${e}`);
        }

        return null;
    }

    getScheduledDirectory() {

        try {
            if(this._config != null) {
                return this._config.schedule_directory;
            }
        }
        catch(e) {
            application.severe(`Exception occurred in Config.getScheduledDirectory() :: ${e}`);
        }

        return null;
    }

    getThreadCount() {

        try {
            if(this._config != null) {
                return this._config.thread_count;
            }
        }
        catch(e) {
            application.severe(`Exception occurred in Config.getThreadCount() :: ${e}`);
        }

        return null;
    }

    getApplicationLogPath() {

        try {
            if(this._config != null) {
                return this._config.application_logpath;
            }
        }
        catch(e) {
            application.severe(`Exception occurred in Config.getApplicationLogPath() :: ${e}`);
        }

        return null;
    }

    getAccessLogPath() {

        try {
            if(this._config != null) {
                return this._config.access_logpath;
            }
        }
        catch(e) {
            application.severe(`Exception occurred in Config.getAccessLogPath() :: ${e}`);
        }

        return null;
    }

    getDBPassword() {

        try {
            if(this._config != null) {
                return this._config.db_password;
            }
        }
        catch(e) {
            application.severe(`Exception occurred in Config.getDBPassword() :: ${e}`);
        }
    }
}

module.exports = new Config("./configuration.json");