const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");

client.on('ready', () => {
  console.log(`-------------------------------\nWelcome to the system Admin With Mysql\nCreator / Developper : MasterLua#9999\nConnected to ${client.user.tag}!\n-------------------------------`);
});

var mysql      = require('mysql');
var con   = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'DiscordDB'
});

function QueryDb(sql, cb){
  con.getConnection(function(err, connection) {
    if (err) {
		console.log(err)
		return
	  }    
    connection.query(sql, function (err, result) {
        connection.release();
      if (err) {
		console.log(err)
		return
	  }
      cb(result).catch(function(error) {
		  console.error(error);
		});
    });
  });
}

client.on('message', message => {
  let args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  let command = args.shift().toLowerCase();
  let userid = message.author.id;
  if(command === "mod") {
    QueryDb("SELECT * FROM moderator WHERE DiscordID = '"+userid+"'", async function(result10){
      if(result10[0] && (result10[0].modo == 2) ){
      }else{
        message.reply("You dont have permission")
        return
      }
      let member = message.mentions.members.first();
      if(args[0] == "add") {
        QueryDb("INSERT INTO `moderator`(`DiscordID`, `modo`) VALUES ('"+member+"',1)", async function(result2){
        message.channel.send("I added the moderator : <@" + member + ">")
        })
      }
      if(args[0] == "remove") {
        QueryDb("DELETE FROM `moderator` WHERE '"+member+"'", async function(result4){
        message.channel.send("I deleted the moderator: <@" + member + ">")
        })
      }
      if(member == undefined) {
        message.reply("Misuse of the command\nExample: !mod add/remove @blabla")
      }
      if(args[0] == undefined) {
        message.reply("Misuse of the command\nExample: !mod add/remove @blabla")
      }
    })
    }
    if(command == "admintest") {
      QueryDb("SELECT * FROM moderator WHERE DiscordID = '"+userid+"'", async function(result99){
        if(result99[0] && (result99[0].modo == 1)){
          message.reply("you're a moderator")
          //your code if moderator
        }else if(result99[0] && (result99[0].modo == 2)){
          message.reply("YOU HAVE FUCKING ALL PERM")
          //your code if not moderator
        }else{
          message.reply("You just user")
        }
      })
    }
});

client.login(config.token);
