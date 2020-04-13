# Blindbot
A discord bot for making blindtest

## Setup
To make the bot working you have to create your own bot on Discord.
  1. Go [here](https://discordapp.com/developers)
  2. Click on "New Application"
  3. Fill information
  4. Go on "Bot" menu and click on "Add Bot"
  5. Copy bot token
  6. Clone this repository and create a new file : "config.json"
  7. Fill like this :
```json
  {
    "creatorId": "xxxxxxxxxxx",
    "prefix": "!",
    "token": "bottoken",
    "rounds": {}
  }
```
creatorId is the blind test master id, the app uses id to limit some commands to the master.
To get a Discord id you can go to [Help section](#help).

prefix is a caracter or a word who have to write before command to trigger the bot.

token is the bot token that you get at point 5.

rounds will be a list of rounds for the blind test.
See Rounds sections for more informations.

## Rounds
The bot works with rounds, you can add as many rounds as you want.
To add a round follow this format :
```json
  {
    ...
    "rounds": {
      "round1": [
        "path to the first song",
        "path to the second",
        ...
      ],
      "round2": [
        "path to the first song",
        "path to the second",
        ...
      ],
      ...
    }
  }
```
In the rounds part of the config file add a round id, to call a round with the play command you will enter this id.
Then give an array of path to the files the bot have to play.


## Commands
The bot has one command for players and some for the master of the game, here is the list of the commands.
Each commands must start with the prefix.

The only command for player is : b or buzz : it pause the music and unmute the player who sends the command.

### Master commands
This command will work with the people who set the id in config file.
- start : this command start the blind test, the bot join the vocal channel where the master is and mutes all other players
- play [roundId] : this command starts the round pass in the command, the round id is the id you put in the config file.
- pause : pause the game and unmute all players
- resume : resume the game and mute all players
- t : like true, it stops the music and remute all players
- f : like false, it resumes the music and remute all players
- n : go to the next music in a round, if the round is finish you can start another
- m : pauses the music
- r : resumes the music

## Help

### User id
To get the id of an user, you have to enable developper mode.
Go to "User settings" in your app, then in "Appearance", then in "Advanced"
After that go to the server where you want to play the game and in the user list right click on the master and select "Copy ID"
