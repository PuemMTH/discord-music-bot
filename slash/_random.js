const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
            .setName("random")
            .setDescription("Sand random")
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("single")
                    .setDescription("Random single pattern a,b,c,d,e,..") 
                    .addStringOption((option) => option.setName("single").setDescription("pattern a,b,c,d,e,..").setRequired(true))
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("dual")
                    .setDescription("Random dual pattern a,b,c,d,e,..")
                    .addStringOption((option) => option.setName("dual").setDescription("pattern a,b,c,d,e,..").setRequired(true))
            ),
	run: async ({ client, interaction }) => {
        if (interaction.options.getSubcommand() === "single" || interaction.options.getSubcommand() === "dual") {
            let pattern = await interaction.options.getString("single") || interaction.options.getString("dual")
            let patternSplit = await pattern.split(',')
            let BeforeSplit = await patternSplit
            console.log(`Before random: ${BeforeSplit}`)
            const Beforelength = await BeforeSplit.length
            let _element, _element2
            let AfterRandom = []

            if (interaction.options.getSubcommand() === "single") {
                for (let i = 0; i < Beforelength; i++) {
                    _element = await BeforeSplit[Math.floor(Math.random() * BeforeSplit.length)];
                    await BeforeSplit.splice(BeforeSplit.indexOf(_element), 1)
                    AfterRandom.push(_element)
                }
            } else {
                for (let i = 0; i < Beforelength; i++) {
                    if (BeforeSplit.length == 0) {
                        break
                    }

                    _element = await BeforeSplit[Math.floor(Math.random() * BeforeSplit.length)];
                    await BeforeSplit.splice(BeforeSplit.indexOf(_element), 1)

                    _element2 = await BeforeSplit[Math.floor(Math.random() * BeforeSplit.length)];
                    await BeforeSplit.splice(BeforeSplit.indexOf(_element2), 1)
                    
                    if (_element == '' || _element == null || _element == undefined) {
                        _element = '-'
                    }
                    if (_element2 == '' || _element2 == null || _element2 == undefined) {
                        _element2 = '-'
                    }

                    AfterRandom.push(_element +" คู่กับ "+ _element2)
                }
            }

            console.log(`After random: ${AfterRandom}`)
            let embeds = new MessageEmbed()
                .setTitle(`Random options: ${interaction.options.getSubcommand()}`)
            let count = 0
            AfterRandom.forEach(element => {
                count++
                embeds.addField(`สมาชิกที่ ${count}`, `${element}`)
            });
            await interaction.editReply({
                embeds: [embeds]
            })

        }
    },
}