const fs = require("fs");
const CONFIG = require("../../Config");

class logger {

    constructor(_logPath) {
        this.INFO = "INFO";
        this.SEVERE = "SEVERE";
        this.WARN = "WARN";

        this._logPath = _logPath;
    }

    setLogPath(_logPath) {
        this._logPath = _logPath;
        return this;
    }
    
    log(level, message) {
        message = level + " :: " + Date.now() + " :: " + message + "\n";
        fs.appendFileSync(this._logPath, message);
    }

    info(message) {
        this.log(this.INFO, message);
    }

    severe(message) {
        this.log(this.SEVERE, message);
    }

    warn(message) {
        this.log(this.WARN, message);
    }
}

module.exports = {
    application : new logger("./logs/application.log"),
    access : new logger("./logs/access.log")
}