/* 
 copyright by acocalypso 2020
 */

const Discord = require('discord.io');
const config = require('./config.json');
const mysql = require('mysql2');
const moment = require('moment');
const cmdPrefix = config.cmdPrefix;

var discordResult = [];

const bot = new Discord.Client({
    token: config.token,
    autorun: true
});

const dbConfigMAD = {
    'host': config.maddb_host,
    'user': config.maddb_username,
    'password': config.maddb_password,
    'database': config.maddb_database,
    'port': config.maddb_port
};

const dbConfigPokesearch = {
    'host': config.pokesearchdb_host,
    'user': config.pokesearchdb_username,
    'password': config.pokesearchdb_password,
    'database': config.pokesearchdb_database,
    'port': config.pokesearchdb_dbport
};

console.log('Starting PokeSearch');


bot.on('ready', function(event){
    console.log('Logged in as %s - %s\n - Language: %s', bot.username, bot.id,config.language);
});


bot.on('message', function (user, userID, channelID, message, event) {
    
        let args = message.substring(cmdPrefix.length).split(' ');
            var cmd = args[0];
            var argPkm = args[1];
            console.log("channelID: " + channelID);
            console.log("mainChannelID: " + config.mainChannelID);
            if (cmd === 'pokesearch' && typeof argPkm !== "undefined" && channelID === config.mainChannelID) {
                console.log("Starting input validation...");
                validateDiscordArgs(argPkm);
	        }
         else{
            if(cmd === 'pokesearch' && typeof argPkm === "undefined")
            {   
                console.log("Nothing found, or wrong input");
                var sentToDiscord = {
                'description': 'Bitte Pokemon angeben!!!',
                'color': 15277667
                };
                bot.sendMessage({
                to: channelID,
                embed: sentToDiscord
                });
            }
            }
    function validateDiscordArgs(pokemon)
    {
        if(pokemon !== ""){
            console.log("validatedPokemon: " + pokemon);
            const connectionPokesearch = mysql.createConnection(dbConfigPokesearch);
            connectionPokesearch.query("SELECT * from pokemon_names WHERE " + config.language + " LIKE '" + pokemon + "'; ", function (err1, rows1, fields1) {
                console.log(this.sql);
            if(rows1.length > 0){    
            rows1.forEach(function(row1){
                    console.log(row1);
                    checkInDB(row1.id, pokemon);
                });
            } else {
                console.log("No Pokemon entry found... unknown Pokemon");
                var sentToDiscord = {
               'description': 'Error...\n' + pokemon + " unknown." ,
               'title': 'UUPPPSSS!',
               'color': 15277667
               };
                bot.sendMessage({
                to: channelID,
                embed: sentToDiscord
                });
                }
                connectionPokesearch.end();
            });
        }
    }
    
    function checkInDB(pkm_id, pkm_name) {
        console.log("checkInDB called");
        discordResult = [];
        const connectionMAD = mysql.createConnection(dbConfigMAD);
        connectionMAD.query('SELECT * FROM pokemon WHERE pokemon_id = ' + pkm_id + " AND disappear_time > UTC_TIMESTAMP();", function (err2, rows2, fields2) {
            if (rows2.length > 0) {
                console.log("Pokemon entries found... getting data...");
                rows2.forEach(function (row2) {

                    //Rewrite JS Date to usefull format
                    const spawnDate = row2.disappear_time;
                    var stillUtc = moment(spawnDate).format("YYYY-MM-DD HH:mm:ss");
                    var despawnTime = moment.utc(stillUtc).local().format("HH:mm:ss DD.MM.YYYY");

                    //Calculate IV
                    const iv_atk = row2.individual_attack;
                    const iv_def = row2.individual_defense;
                    const iv_sta = row2.individual_stamina;
                    const iv = (iv_atk + iv_def + iv_sta) / 45 * 100;
                    const total_iv = iv.toFixed(2);
                    //get custome id
                    const costume = row2.costume;
                    const costume_padded = pad(costume, 2);
                    //Change the id to 3 digit format
                    const pkm_id_padded = pad(pkm_id, 3);

                    var sentToDiscord = {
                        'description': 'Pokemon: ' + pkm_name + '\nWP: ' + row2.cp + '\nIV: ' + total_iv + '\nATK: ' + iv_atk + ' DEF: ' + iv_def + ' STA: ' + iv_sta + "\nDespawn: " + despawnTime,
                        'title': 'Google Maps',
                        'url': 'http://maps.google.com/maps?q=' + row2.latitude + ',' + row2.longitude,
                        'color': 15277667,
                        'thumbnail': {
                            'url': 'https://raw.githubusercontent.com/ZeChrales/PogoAssets/master/pokemon_icons/pokemon_icon_' + pkm_id_padded + '_00_' + costume_padded + '.png'
                        }
                    };
                    discordResult.push(sentToDiscord);
                });
                console.log("ResultCount: %s", discordResult.length);
                for (let i = 0; i < discordResult.length; i++) {
                    setTimeout(() => {
                        sentDiscordMessages(discordResult[i]);
                    }, i * 1500);
                }
            } else {
                console.log("No Pokemon found");
                var sentToDiscord = {
                    'description': pkm_name + ' not in availiable at the moment.',
                    'title': 'Sorry!',
                    'color': 15277667
                };
                bot.sendMessage({
                    to: channelID,
                    embed: sentToDiscord
                });
            }
            connectionMAD.end();
        });

    };

    function pad(n, length) {
        var len = length - ('' + n).length;
        return (len > 0 ? new Array(++len).join('0') : '') + n
    }

    function sentDiscordMessages(results,pkm_id) {
        bot.sendMessage({
            to: channelID,
            embed: results
        });
    };
},
function(error, response)
{
    console.log(error);
});