class MysqlHandler {

    constructor() {

        let mysql = require('mysql');

        this.connection = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : '*****' //Configure db password here.
        });
    }

    useDatabase(dbName) {
        
        return new Promise( (resolve, reject) => {

            //this.connection.connect();

            this.connection.changeUser({database : dbName}, (err) => {
                if(err) {
                    reject(err);
                    return;
                }

                resolve(true);
            });

        });
    }

    executeQuery(query, params) {

        return new Promise( (resolve, reject) => {

            let connection = this.connection;

            //connection.connect();
            
            connection.query(query, params, function (error, results, fields) {

                if(error) {
                    reject(error);
                    return;
                }

                resolve(results);
            });
            
            //connection.end();
        });
    }
}

module.exports = new MysqlHandler(); //Singleton Design pattern