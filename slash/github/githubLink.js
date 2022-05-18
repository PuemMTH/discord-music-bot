const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("github").setDescription("Sand box for github info"),
	run: async ({ client, interaction }) => {
        const memberscount = interaction.guild.members.cache.filter(member => member).size
        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setTitle("Github Users Info")
                    .setDescription(`Server Name: ${interaction.guild.name}, \nServer ID: ${interaction.guild.id}, \nMembers Online: ${memberscount}`)
                    .setColor("#00ff00")
                    .setThumbnail(interaction.guild.iconURL())
            ]
        })
	},
}