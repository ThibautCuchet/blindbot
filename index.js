const Discord = require("discord.js");
const { creatorId, prefix, token, manches } = require("./config.json");

const client = new Discord.Client();
let buzzed = false;
let buzzedUsername = "";
let currentManche = "";
let indexManche = 0;
let voiceConnection = null;
let dispatcher = null;
let started = false;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  const args = msg.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();
  if (msg.author.id === creatorId && command === "start") {
    buzzed = false;
    started = false;
    msg.member.voice.channel
      .join()
      .then(connection => (voiceConnection = connection));
    muteAll(msg.member.voice.channel);
    msg.channel.send("La partie commence !");
  }
  if (started && !buzzed && command == "buzz") {
    buzzed = true;
    buzzedUsername = msg.author.username;
    dispatcher.pause();
    msg.channel.send(`${buzzedUsername} a la parole`);
    muteAll(msg.member.voice.channel);
    msg.member.voice.setMute(false);
  }
  if (started && buzzed && msg.author.id == creatorId && command == "v") {
    buzzed = false;
    msg.channel.send(`La réponse de ${buzzedUsername} est bonne`);
    muteAll(msg.member.voice.channel);
  }
  if (started && buzzed && msg.author.id == creatorId && command == "f") {
    buzzed = false;
    dispatcher.resume();
    msg.channel.send(`Remis en jeux`);
    muteAll(msg.member.voice.channel);
  }
  if (started && msg.author.id == creatorId && command == "n") {
    dispatcher.pause();
    console.log(indexManche, manches[currentManche].length);
    buzzed = false;
    if (indexManche < manches[currentManche].length - 1) {
      indexManche++;
      dispatcher = voiceConnection.play(manches[currentManche][indexManche]);
    } else {
      msg.channel.send("La manche est finie");
      started = false;
      unmuteAll(msg.member.voice.channel);
    }
  }
  if (started && msg.author.id == creatorId && command == "pause") {
    started = false;
    if (dispatcher != null && !dispatcher.paused) dispatcher.pause();
    msg.channel.send("Mise en pause !");
    unmuteAll(msg.member.voice.channel);
  }
  if (
    !started &&
    dispatcher != null &&
    dispatcher.paused &&
    msg.author.id == creatorId &&
    command == "resume"
  ) {
    started = true;
    dispatcher.resume();
    msg.channel.send("Reprise !");
    muteAll(msg.member.voice.channel);
  }
  if (!started && msg.author.id == creatorId && command == "play") {
    buzzed = false;
    started = true;
    currentManche = args[0];
    dispatcher = voiceConnection.play(manches[currentManche][indexManche]);
    msg.channel.send("La manche est lancée !");
    muteAll(msg.member.voice.channel);
  }
  if (started && msg.author.id == creatorId && command == "stop") {
    buzzed = false;
    started = false;
    msg.channel.send("Fin de la partie !");
    msg.member.voice.channel.leave();
    unmuteAll(msg.member.voice.channel);
  }
  msg.delete();
});

function muteAll(voiceChannel) {
  voiceChannel.members.forEach(member => {
    if (member.id != creatorId && !member.user.bot) member.voice.setMute(true);
  });
}

function unmuteAll(voiceChannel) {
  voiceChannel.members.forEach(member => {
    if (member.id != creatorId) member.voice.setMute(false);
  });
}

client.login(token);
