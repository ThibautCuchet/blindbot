const Discord = require("discord.js");
const { creatorId, prefix, token, sounds } = require("./config.json");

const client = new Discord.Client();
let buzzed = false;
let buzzedUsername = "";
let voiceConnection = null;
let dispatcher = null;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  const args = msg.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();
  if (msg.author.id === creatorId && command === "start") {
    buzzed = true;
    msg.member.voice.channel
      .join()
      .then(connection => (voiceConnection = connection));
    muteAll(msg.member.voice.channel);
    msg.channel.send("La partie commence !");
  }
  if (!buzzed && command == "buzz") {
    buzzed = true;
    buzzedUsername = msg.author.username;
    muteAll(msg.member.voice.channel);
    msg.member.voice.setMute(false);
  }
  if (buzzed && msg.author.id == creatorId && command == "v") {
    buzzed = false;
    msg.channel.send(`La réponse de ${buzzedUsername} est bonne`);
    muteAll(msg.member.voice.channel);
  }
  if (buzzed && msg.author.id == creatorId && command == "f") {
    buzzed = false;
    msg.channel.send(`Remis en jeux`);
    muteAll(msg.member.voice.channel);
  }
  if (!buzzed && msg.author.id == creatorId && command == "pause") {
    buzzed = true;
    msg.channel.send("Fin de la manche !");
    unmuteAll(msg.member.voice.channel);
  }
  if (buzzed && msg.author.id == creatorId && command == "play") {
    buzzed = false;
    msg.channel.send("La manche est lancée !");
    muteAll(msg.member.voice.channel);
  }
  if (msg.author.id == creatorId && command == "stop") {
    buzzed = true;
    msg.channel.send("Fin de la partie !");
    msg.member.voice.channel.leave();
    unmuteAll(msg.member.voice.channel);
  }
  if (msg.author.id == creatorId && command == "sound") {
    dispatcher = voiceConnection.playFile(sounds.adele);
  }
  msg.delete();
});

function muteAll(voiceChannel) {
  voiceChannel.members.forEach(member => {
    if (member.id != creatorId) member.voice.setMute(true);
  });
}

function unmuteAll(voiceChannel) {
  voiceChannel.members.forEach(member => {
    if (member.id != creatorId) member.voice.setMute(false);
  });
}

client.login(token);
