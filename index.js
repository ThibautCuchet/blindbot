const Discord = require("discord.js");
const { creatorId, prefix, token, rounds } = require("./config.json");

const client = new Discord.Client();
let buzzed = false;
let buzzedUser = null;
let currentRound = "";
let indexRound = 0;
let voiceConnection = null;
let dispatcher = null;
let started = false;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;
  const args = msg.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();
  if (msg.author.id === creatorId && command === "start") {
    buzzed = false;
    started = false;
    msg.member.voice.channel
      .join()
      .then((connection) => (voiceConnection = connection));
    muteAll(msg.member.voice.channel);
    msg.channel.send("The blind test is starting !");
  }
  if (started && !buzzed && (command == "buzz" || command == "b")) {
    buzzed = true;
    buzzedUser = msg.member;
    dispatcher.pause();
    msg.channel.send(`<@${buzzedUser.id}> it's your turn`);
    msg.member.voice.setMute(false);
  }
  if (started && buzzed && msg.author.id == creatorId && command == "t") {
    buzzed = false;
    buzzedUser.voice.setMute(true);
  }
  if (started && buzzed && msg.author.id == creatorId && command == "f") {
    buzzed = false;
    buzzedUser.voice.setMute(true);
    dispatcher.resume();
  }
  if (started && msg.author.id == creatorId && command == "n") {
    buzzed = false;
    dispatcher.pause();
    buzzed = false;
    if (indexRound < rounds[currentRound].length - 1) {
      indexRound++;
      dispatcher = voiceConnection.play(rounds[currentRound][indexRound]);
    } else {
      msg.channel.send("It's the end of the round");
      started = false;
    }
  }
  if (started && msg.author.id == creatorId && command == "pause") {
    started = false;
    buzzed = true;
    if (dispatcher != null && !dispatcher.paused) dispatcher.pause();
    msg.channel.send("Pause the blind test !");
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
    buzzed = false;
    dispatcher.resume();
    msg.channel.send("Resume !");
    muteAll(msg.member.voice.channel);
  }
  if (!started && msg.author.id == creatorId && command == "play") {
    buzzed = false;
    started = true;
    indexRound = 0;
    currentRound = args[0];
    dispatcher = voiceConnection.play(rounds[currentRound][indexRound]);
    msg.channel.send("The round is starting !");
  }
  if (msg.author.id == creatorId && command == "stop") {
    buzzed = false;
    started = false;
    msg.channel.send("End of the blind test !");
    msg.member.voice.channel.leave();
    unmuteAll(msg.member.voice.channel);
  }
  if (msg.author.id == creatorId && command == "m") {
    buzzed = true;
    dispatcher.pause();
  }
  if (msg.author.id == creatorId && command == "r") {
    buzzed = false;
    dispatcher.resume();
  }
  msg.delete();
});

function muteAll(voiceChannel) {
  voiceChannel.members.forEach((member) => {
    try {
      if (member.id != creatorId && !member.user.bot)
        member.voice.setMute(true);
    } catch (e) {
      console.log("Problem with ", member.username);
    }
  });
}

function unmuteAll(voiceChannel) {
  voiceChannel.members.forEach((member) => {
    try {
      if (member.id != creatorId) member.voice.setMute(false);
    } catch (e) {
      console.log("Problem with ", member.username);
    }
  });
}

client.login(token);
