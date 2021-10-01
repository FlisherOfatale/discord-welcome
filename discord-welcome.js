/*
	Welcome Module for DiscordJS
	Author: Flisher (andre@jmle.net)
    
  * Send private or public welcome message
  * @param  {Bot} bot - The discord.js CLient/bot
  * @param  {object} options - Optional (Custom configuarion options, use @MEMBER to replace by the member mention, @GUILDNAME for the guildname)
  * @return {[type]}         [description]

*/

module.exports = function (client, options) {

  const description = {
    name: `discord-welcome`,
    filename: `discord-welcome.js`,
    version: `3.0.3`
  }

  console.log(`Module: ${description.name} | Loaded - version ${description.version} from ("${description.filename}")`)
  const DiscordJSversion = require("discord.js").version.substring(0, 2)

  if (DiscordJSversion === '11') console.error("This version of discord-welcome only run on DiscordJS V13 and up, please run \"npm i discord-playing@discord.js-v11\" to install an older version")
  if (DiscordJSversion === '12') console.error("This version of discord-welcome only run on DiscordJS V13 and up, please run \"npm i discord-playing@discord.js-v12\" to install an older version")
  if (DiscordJSversion !== '13') return

  // Check that required Gateway Intention
  const {
    Intents
  } = require('discord.js');
  const liveIntent = new Intents(client.options.intents)
  const requiredIntent = ['GUILDS', 'GUILD_MEMBERS']
  const gotAllIntent = liveIntent.has(requiredIntent)

  if (gotAllIntent) {
    // continue to run
  } else {
    console.log(`Module: ${description.name} | Version ${description.version} NOT initialized due to the following reasons ")`)
    for (let i in requiredIntent) {
      let checkedIntent = requiredIntent[i]
      if (!liveIntent.has(requiredIntent[i])) {
        console.log(`Module: ${description.name} | Missing Gateway Intent ${requiredIntent[i]}`)
      }
    }
  }

  // Event Handlers
  client.on('guildMemberAdd', member => {
    // Set options
    let privatemsg = (options && options.privatemsg) || (options[member.guild.id] && options[member.guild.id].privatemsg) || null;
    let publicmsg = (options && options.publicmsg) || (options[member.guild.id] && options[member.guild.id].publicmsg) || null;
    let publicchannel = (options && options.publicchannel) || (options[member.guild.id] && options[member.guild.id].publicchannel) || null;

    // ********** CODE FOR PUBLIC MESSAGE **********  
    if (publicmsg && publicchannel) {
      let channel = member.guild.channels.cache.find(val => val.name === publicchannel) || member.guild.channels.cache.get(publicchannel);
      if (!channel) {
        console.log(`Channel "${publicchannel}" not found`);
      } else {
        if (channel.permissionsFor(client.user).has('SEND_MESSAGES')) {
          // Prepare the Message by replacing the @MEMBER tag to the user mention
          if (typeof publicmsg === "object") {
            // Embed
            embed = publicmsg;
            channel.send({
              embed
            });
          } else {
            msg = publicmsg.replace(`@MEMBER`, `${member.user}`);
            msg = msg.replace(`@GUILDNAME`, `${member.guild.name}`);

            // Send the Message
            channel.send(msg);
          }
        } else {
          console.log(`The Bot doesn't have the permission to send public message to the configured channel "${publicchannel}"`)
        }
      }
    }


    // ********** CODE FOR PRIVATE MESSAGE **********            
    if (privatemsg) {
      msg = publicmsg.replace(`@MEMBER`, `${member.user}`);
      msg = msg.replace(`@GUILDNAME`, `${member.guild.name}`);
      member.send(privatemsg)
    }
  });

  /*
	client.on('guildMemberRemove', member => {
		// Take action when someone leave the server
    });
    */
}