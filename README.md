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
	"token": "",   //bot token
	"cmdPrefix": "!", //prefix for discord bot command
	"host": "", // your hostname (f.e localhost)
	"username": "", //database username
	"password": "", //database password
	"database": "", //MAD database name
	"database_pokesearch": "", //pokesearch database name
	"port": "" //Mysql Port (default 3306)
}
```

Run the db import script

```sh
node db_create.js
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
This Bot currently only support German Pokemon and its in an early development stage.

## ToDo
- Fix conversation of despawn time to localtime
- add more search parameter like iv, wp, level


## Contributing

1. Fork it (<https://github.com/yourname/yourproject/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
