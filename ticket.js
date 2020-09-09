const Discord = require("discord.js");//////remember that the file name can be changed like, server.js, bot.js, etc.
const client = new Discord.Client();
const config = require("./config.json");
var canal_id = "  ";//////enter the id of the channel you want to send the ticket message
var msg_id;

client.once("ready", () => {
    console.log(`logging in as ${client.user.tag}`)
    var canal = client.channels.cache.get(canal_id);
        canal.bulkDelete(1);
    crearMsgTicket(canal);
});

function crearMsgTicket(canal){
    const embed = new Discord.MessageEmbed()
    .setDescription("reaction to '📂' to open a ticket and receive help from a support")//////fully editable message
    .setThumbnail(client.user.displayAvatarURL({format: "png", dynamic: true}));
    canal.send(embed).then(msg => {
        msg_id = msg.id;
        msg.react("📂");
    });
}

client.on('messageReactionAdd', async(reaction, user) => {

    if (user.bot) return;
    if (!msg_id) return;

    if (reaction.message.id == msg_id && reaction.emoji.name == "📂") {
        crearTicket(reaction.message, user);
        reaction.message.reactions.removeAll();
        reaction.message.react("📂");
    }
function EnviarMensaje(canal, user){
    canal.send(`<@${user.id}> here is your ticket, if you want to close it press ❌`).then(msg => {//////fully editable message
        msg.react("❌");
    });

}

function crearTicket(message, user){
    var canal = message.guild.channels.cache.find(c => c.name == `ticket-${user.id}`);
    if (!canal) {
        message.guild.channels.create(`ticket-${user.id}`,{reason: "ticket"}).then(channel => {
            EnviarMensaje(channel, user);

            var rol = message.guild.roles.cache.find(r => r.name === "@everyone");

            channel.createOverwrite(user, {
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true,
                READ_MESSAGE_HISTORY: true,
            });

            channel.createOverwrite(rol, {
                SEND_MESSAGES: false,
                VIEW_CHANNEL: false,
            });

        });

    }
}

client.on("message", async message => {
    if(message.content === "close-ticket"){
        if(message.channel.name.startsWith("ticket-")) message.channel.delete();
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
    
    if(user.bot) return;
    if(!msg_id) return;

    if(reaction.message.id == msg_id && reaction.emoji.name == "📂"){
        crearTicket(reaction.message, user);
        reaction.message.reactions.removeAll();
        reaction.message.react("📂");
    }
    if(reaction.message.channel.name.startsWith("ticket-") && reaction.emoji.name == "❌"){
        reaction.message.channel.delete();
    }
});
