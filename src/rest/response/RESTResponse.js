module.exports = class RESTResponse {

    constructor(code, message) {

        this.code = code;
        this.message = message;
    }

    getCode() {
        return this.code;
    }

    setCode(code) {
        this.code = code;
        return this;
    }

    getMessage() {
        return this.message;
    }

    setMessage(message) {
        this.message = message;
        return this;
    }
}