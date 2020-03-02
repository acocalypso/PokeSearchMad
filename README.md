# PokeSearchMAD
> Discord Bot to search for pokemon in the MAD DB


## Installation

- Create a new discord Bot -> [GUIDE](https://discordpy.readthedocs.io/en/latest/discord.html)
- Invite the Bot to your Discord Server
- Rename config.json.example to config.json
- Setup a new Mysql DB to save the pokemon names and ID's (pokesearch database).
- Edit config.json and fill out the required infos.


```sh
{ 
  "token": "", //bot token
  "cmdPrefix": "!", //prefix for discord command
  "language": "", //availiable pokemons german,english,japanese
  "mainChannelID": "", //channel for the command
  "maddb_host": "", //mad db hostname
  "maddb_username": "", // mad db username
  "maddb_password": "", // mad db password
  "maddb_database": "", // mad db database
  "maddb_dbport": "", // mad db port (3306)
  "pokesearchdb_host": "", // pokesearch db hostname
  "pokesearchdb_username": "", // pokesearch db username
  "pokesearchdb_password": "", // pokesearch db password
  "pokesearchdb_database": "", // pokesearch db database
  "pokesearchdb_dbport": "" // pokesearch db port (3306)
}
```
Install node dependecies

```
npm install
```


Run the db import script

```sh
node db_pokesearch.js
```

Now start the bot

```sh
node main.js
```

## Usage example

!pokesearch Zubat

Output:

```sh
Google Maps
Pokemon: Zubat
WP: 36
IV: 2.22
ATK: 0 DEF: 0 STA: 1
Verfügbar bis: 22:16:38 21.01.2020
```

## Additional IMPORTANT Infos:
This bot is in early development.
Current supported languages for Pokemon: german, english, japanese

If you already running a previous version, please drop your database first and import the new one.

## ToDo
- ~~Fix conversation of despawn time to localtime~~
- add more search parameter:
  iv
  wp
  level
- localisation


## Contributing

1. Fork it (<https://github.com/yourname/yourproject/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
