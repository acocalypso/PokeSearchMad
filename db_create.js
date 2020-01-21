/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const config = require("./config.json");
const mysql = require('mysql2');
const fs = require("fs");
const fastcsv = require("fast-csv");

let stream = fs.createReadStream("pokemon.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    //csvData.shift();

    // create a new connection to the database
    const connection = mysql.createConnection({
      host: config.hostname,
      user: config.username,
      password: config.password,
      database: config.database_pokesearch
    });

    // open the connection
    connection.connect(error => {
      if (error) {
        console.error(error);
      } else {
        let create_table = "CREATE TABLE pokemon (id INT AUTO_INCREMENT PRIMARY KEY, pkm_id INT, pkm_name VARCHAR(255))";
        connection.query(create_table, (error, response) => {
            console.log(error || response);            
        });
        let query =
          "INSERT INTO pokemon (pkm_id, pkm_name) VALUES ?";
        connection.query(query, [csvData], (error, response) => {
          console.log(error || response);
        });
      }
    });
  });

stream.pipe(csvStream);

          