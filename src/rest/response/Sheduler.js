
const RESTResponse = require("./RESTResponse");

module.exports = class Scheduler extends RESTResponse {

    constructor() {

        super();
        
        this.scheduler_id = undefined;
        this.start_time = undefined;
        this.end_time = undefined;
        this.file_added = undefined;
        this.file_deleted = undefined;
        this.magic_count = undefined;
        this.status = undefined;
    }

    getSchedulerId() {
        return this.scheduler_id;
    }

    setSchedulerId(scheduler_id) {
        this.scheduler_id = scheduler_id;
        return this;
    }

    getStartTime() {
        return this.start_time;
    }

    setStartTime(start_time) {
        this.start_time = start_time;
        return this;
    }

    getEndTime() {
        return this.end_time;
    }

    setEndTime(end_time) {
        this.end_time = end_time;
        return this;
    }

    getFileAdded() {
        return this.file_added;
    }

    setFileAdded(file_added) {
        this.file_added = file_added;
        return this;
    }

    getFileDeleted() {
        return this.file_deleted;
    }

    setFileDeleted(file_deleted) {
        this.file_deleted = file_deleted;
        return this;
    }

    getMagicCount() {
        return this.magic_count;
    }

    setMagicCount(magic_count) {
        this.magic_count = magic_count;
        return this;
    }

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
        return this;
    }
}