const mysql = require('mysql2');
import {DatabaseInformation,TableColumn} from '../types';

const getTableSchema = (dbInfo:DatabaseInformation,tableName:String) => new Promise<Array<TableColumn>>((response,reject) => {
	const connection = mysql.createConnection({
        host: dbInfo.host,
        port: dbInfo.port,
        user: dbInfo.username,
        password: dbInfo.password,
        database: dbInfo.database
  });

  connection.connect((error:any) => {
    if (error) {
        reject(error);
    } else {
        connection.query('DESC '+tableName, function (error: any, results: any, fields:any) {
            if (error) {
                reject(error);
            } else {
                let schema:Array<TableColumn> = [];
                results.forEach(function(dbCol:any) {
                    let column: TableColumn = {
                        name: dbCol.Field,
                        type: dbCol.Type,
                        nullable: dbCol.Null==="YES",
                        primaryKey: dbCol.Key==="PRI",
                        foreignKey: dbCol.Key==="MUL",
                        autoIncrement: dbCol.Extra.includes("auto_increment") ?? false
                    };
                    schema.push(column);
                });
                response(schema);
            }
        });

        connection.end();
    }
  });


});

export default getTableSchema;
