const { request } = require('http');
const { response } = require('express');
const GetScheduler = require('../../handler/GetScheduler');
const DeleteScheduler = require('../../handler/DeleteScheduler');
const CreateScheduler = require('../../handler/CreateScheduler');

module.exports = function(app) {

    app.get("/api/v1/job/info", (request, response) => {
        
        new GetScheduler().getInfo().then( (result) => {
            response.json(result);
        }, (error) => {
            response.json(error);
        });
    });

    app.post("/api/v1/job/create", (request, response) => {

        let query = request.query;

        new CreateScheduler(query.cron_pattern, query.magic_string, query.directory).create().then( (result) => {
            response.json(result);
        }, (error) => {
            response.json(error);
        });
    });
    
    app.delete("/api/v1/job/delete", (request, response) => {
        
        let ids = JSON.parse(request.query.ids);

        new DeleteScheduler().delete(request.query.ids).then( (result) => {
            response.json(result);
        }, (error) => {
            response.json(error);
        });
    });
}
