const config = require('./config.json');
const mysql_import = require('mysql-import');

const pokesearch_importer = mysql_import.config({
	host: config.pokesearchdb_host,
	user: config.pokesearchdb_username,
	password: config.pokesearchdb_password,
	database: config.pokesearchdb_database,
	port: config.pokesearchdb_port,
	onerror: err => console.log(err.message)
});
pokesearch_importer.import('pokemon_names.sql');