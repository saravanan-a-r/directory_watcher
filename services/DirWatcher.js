const redis = require("redis");
global.client = redis.createClient();

const fs = require("fs");

module.exports = class DirWatcher {

    constructor() {

    }
 
    startService() {

        this._initializeDatabase();
        this._urlPattern();
    }

    _initializeDatabase() {
        
        return new Promise( async (resolve, reject) => {

            try {
                let handler = require('../src/data_layer/MysqlHandler');

                await handler.executeQuery(`create database if not exists dir_watcher`);
                
                await handler.useDatabase(`dir_watcher`);

                await handler.executeQuery(`
                    create table if not exists task(
                        ID bigint not null auto_increment,
                        created_time bigint not null,
                        cron_pattern varchar(1000) not null,
                        magic_string varchar(1000) not null,
                        directory varchar(1000) not null,
                        primary key(ID)
                    )
                `);

                await handler.executeQuery(`
                    create table if not exists task_occurance(
                        ID bigint not null,
                        start_time bigint not null,
                        end_time bigint not null,
                        file_added bigint,
                        file_deleted bigint,
                        magic_count bigint,
                        status int,
                        cron_pattern varchar(1000),
                        primary key(ID)
                    )
                `);

                resolve();
            }
            catch(e) {
                console.log(`FATAL ERROR. CAN'T INITIALIZE SERVICE :: ${e}`);
                throw e;
            }
        });
    }

    _urlPattern() {
        
        let redisClient = global.client;

        redisClient.on("error", (error) => {
            console.log(`FATAL ERROR. CAN'T INITIALIZE URL PATTERN :: ${error}`);
        });
        
        let deleteJson = fs.readFileSync(__dirname + "/../src/rest/security/security-delete.json");
        let getJson = fs.readFileSync(__dirname + "/../src/rest/security/security-get.json");
        let postJson = fs.readFileSync(__dirname + "/../src/rest/security/security-post.json");

        redisClient.set("DELETE", deleteJson);
        redisClient.set("GET", getJson);
        redisClient.set("POST", postJson);
    }
}