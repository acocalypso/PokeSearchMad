/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const Discord = require('discord.io');
const config = require('./config.json');
const mysql = require('mysql2');
const moment = require('moment');

const bot = new Discord.Client({
    token: config.token,
    autorun: true
});

const dbConfigMAD = {
  'host': config.host,
  'user': config.username,
  'password': config.password,
  'database': config.database,
  'port': config.port
};

const dbConfigPokesearch = {
  'host': config.host,
  'user': config.username,
  'password': config.password,
  'database': config.database_pokesearch,
  'port': config.port
};

console.log('Starting PokeSearch');

const connectionMAD = mysql.createConnection(dbConfigMAD);
const connectionPokesearch = mysql.createConnection(dbConfigPokesearch);

bot.on('ready', function(event){
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
});


bot.on('message', function (user, userID, channelID, message, event) {
    
        if (message.substring(0, 1) === '!') {
	var args = message.substring(1).split(' ');
        var cmd = args[0];
        var argPkm = args[1];

        if(cmd === 'pokesearch' && typeof argPkm !== "undefined"){

            validateDiscordArgs(argPkm);
	}
         else{
            console.log("Nix zu tun!");

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
            console.log("valPkm: " + pokemon);
        connectionPokesearch.query('SELECT pkm_id, pkm_name from pokemon WHERE pkm_name LIKE "' + pokemon + '";', function(err1, rows1,fields1){
            if(rows1.length > 0){    
            rows1.forEach(function(row1){
                    console.log(row1);
                    const pkm_name = row1.pkm_name;
                    const pkm_id = row1.pkm_id;
                    checkInDB(pkm_id, pkm_name);
                });
            }else{
            var sentToDiscord = {
               'description': 'Fehler in der Eingabe...\n' + pokemon + " ist kein bekanntes Pokemon." ,
               'title': 'UUPPPSSS!',
               'color': 15277667
               };
                bot.sendMessage({
                to: channelID,
                embed: sentToDiscord
                });
            
        }
            });
        }
    }
    
    function checkInDB(pkm_id, pkm_name)
    {       
            const madquery = connectionMAD.query('SELECT * FROM pokemon WHERE pokemon_id = ' + pkm_id + " AND disappear_time > UTC_TIMESTAMP();",function(err2,rows2,fields2){
               rows2.forEach(function(row2){

               //Rewrite JS Date to usefull format
               const spawnDate = moment(row2.disappear_time).format();
               const disappearTime = moment.utc(spawnDate).local().format("HH:mm:ss DD.MM.YYYY");
               
               console.log("disTime: " + disappearTime);

               
               //Calculate IV
               const iv_atk = row2.individual_attack;
               const iv_def = row2.individual_defense;
               const iv_sta = row2.individual_stamina;
               const iv = (iv_atk + iv_def + iv_sta) / 45 * 100;
               const total_iv = iv.toFixed(2);             
               
               if(rows2.length > 0){
               var sentToDiscord = {
               'description': 'Pokemon: ' + pkm_name + '\nWP: ' + row2.cp + '\nIV: ' + total_iv + '\nATK: ' + iv_atk + ' DEF: ' + iv_def + ' STA: ' + iv_sta + "\nVerfügbar bis: " + disappearTime,
               'title': 'Google Maps',
               'url': 'http://maps.google.com/maps?q='+row2.latitude+','+row2.longitude,
               'color': 15277667
               };
                bot.sendMessage({
                to: channelID,
                embed: sentToDiscord
                });
            }
            if(rows2.length < 0){
                var sentToDiscord = {
               'description': pkm_name + ' aktuell nicht vorhanden.',
               'title': 'UUPPPSSS!',
               'color': 15277667
               };
                bot.sendMessage({
                to: channelID,
                embed: sentToDiscord
                });
            }
            });
            });
        };
},
function(error, response)
{
    console.log(error);
});




                


