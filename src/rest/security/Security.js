const access = require("./src/utils/logger").access;

module.exports = class Security {

    constructor() {

    }

    securityFilter(request) {

        let method = request.method;
        if(method) {
            access.severe(`request method not found!!!`);
            return false;
        }

        let receivedQueryParams = request.query;

        let securityFilter = redisClient.get(method);
        let requestPattern = securityFilter[request.path];
        let queryParamPattern = requestPattern["query_params"];

        /* ---- Mandatory params checker --- */
        for(let property in queryParamPattern) {

            if(queryParamPattern[property].is_mandatory && !receivedQueryParams[property]) {
                access.severe(`${property} query param required`);
                return false;
            }
        }

        /* --- Regex checker --- */
        for(let property in receivedQueryParams) {

            if(!new RegExp(queryParamPattern[property].regex).test(receivedQueryParams[property])) {
                access.severe(`${property} regex format invalid`);
                return false;
            }
        }

        return true;
    }

}