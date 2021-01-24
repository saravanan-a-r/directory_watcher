const fs = require("fs");
const path = require("path")
const error_code = require("./error_code");
const application = require("./logger").application;

module.exports = class MagicCount {

    constructor(_relativePath, _threadCount, _magicString, _queue, _runningProcess) {
        this._relativePath = _relativePath;
        this._threadCount = _threadCount || 1;
        this._queue = _queue;
        this._runningProcess = _runningProcess || 0;
        this._magicString = _magicString;
        this._magicCount = 0;
    }

    setDirectoryPath(_relativePath) {
        this._relativePath = _relativePath;
        return this;
    }

    setThreadCount(_threadCount) {
        this._threadCount = _threadCount;
        return this;
    }

    setQueue(_queue) {
        this._queue = _queue;
        return this;
    }

    setRunningProcess(_runningProcess) {
        this._runningProcess = _runningProcess;
        return this;
    }

    incrementRunningProcess(count = 1) {
        this._runningProcess = this._runningProcess + 1;
    }

    decrementRunningProcess(count = 1) {
        this._runningProcess = this._runningProcess - 1;
    }

    init() {

        return new Promise( async (resolve, reject) => {

            let _relativePath = this._relativePath;

            if(!fs.existsSync(_relativePath)) {
                application.severe("Directory path doesn't exist in file system");
                reject(error_code.DIRECTORY_NOT_VALID);
            }

            if(!this._magicString) {
                application.info("_magicString is undefined");
                resolve(error_code.MAGIC_STRING_NULL);
                return;
            }

            /* --- Recursively get file list --- */ 
            let allFiles = this.getAllFiles(_relativePath);
           
            /* --- 
                Initiate magic word counting process with 
                the thread pool size 
            -- */
            await this.runCountProcess();

            /* --- 
                Compare files in this folder with previous state
            --- */
            let {addedFiles, deletedFiles} = this.getChanges(allFiles);

            console.log("Count :: " + this._magicCount);
            console.log("Added :: " + addedFiles);
            console.log("Deleted :: " + deletedFiles);

            resolve();
        });
    }

    getAllFiles(dirPath) {

        let files = fs.readdirSync(dirPath);
      
        let allFiles = [];

        this._queue = this._queue || [];
      
        files.forEach((file) => {

            if(fs.statSync(dirPath + "/" + file).isDirectory()) {

                allFiles = this.getAllFiles(dirPath + "/" + file);
            }
            else {

                let eachFile = path.join(dirPath, "/", file);
                this._queue.push(eachFile);
                allFiles.push(eachFile);
            }
        });
      
        return allFiles;
    }

    runCountProcess() {
        
        return new Promise( (resolve, reject) => {

            if(this._queue == null || this._queue.length == 0) {
                resolve(this._magicCount);
                return;
            }

            if(this._runningProcess >= this._threadCount) {
                resolve(this._magicCount);
                return;
            }

            let filePath = this._queue.pop();

            let start = 0;

            let readStream = fs.createReadStream(filePath);
        
            readStream.on("open", (data) => {
                this.incrementRunningProcess();
            });
       
            readStream.on("data", (data) => {
               
                data = data.toString();

                let streamLength = data.length;
                let magicLength = this._magicString.length;

                let end = -1 ;
                let i = 0, j = start;

                for(; i < streamLength && j < magicLength; i++) {

                    if(data[i] == this._magicString[j]) {
                    
                        end = j;
                        j++;

                        if(j == magicLength) {
                            this._magicCount = this._magicCount + 1;
                            j = 0;
                            end = -1;
                        }

                        continue;
                    }

                    end = -1;
                }

                if(end != -1 && i >= streamLength) {
                    start = end + 1;
                }
            });

            readStream.on("error", (err) => {
                this.decrementRunningProcess();
            });

            readStream.on("end", (data) => {
                this.decrementRunningProcess();
                resolve(this._magicCount);
            });  

        });      
    }

    getChanges(newList) {

        return {
            addedFiles : 0,
            deletedFiles : 1
        }
    }
}