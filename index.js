const Discord = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
const fs = require("fs")
const { Player } = require("discord-player")

dotenv.config()
const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = "888828682918064169"

const GUILD_ID = [
    "846950166702850048", // KU81
    "858406135856627712", // sugar daddy
    "945370321719009330", // Top Secret
    "959175667738640395", // app
    "966733520338821210", // Server Test
    "969131573402284072", //Media for Learning
    "728889612965249044",
    "941286057884917770", // Consci Let saaaa goooo!!!
    "432792639600066570", // Family
    "888033988789276702"  //devZone
]

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_VOICE_STATES"
    ]
})

client.slashcommands = new Discord.Collection()
client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

let commands = []

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
    console.log(`Loaded slash command: ${slashcmd.data.name}`)
}

if (LOAD_SLASH) {
    const rest = new REST({ version: "9" }).setToken(TOKEN)
    GUILD_ID.forEach(async (guildId) => {
        console.log("Deploying slash commands")
        rest.put(Routes.applicationGuildCommands(CLIENT_ID, guildId), {body: commands})
        .then(() => {
            console.log("Successfully loaded")
        })
        .catch((err) => {
            console.log("Error: ", guildId)
        })
    })
} else {
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}`)
    })
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return

            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply("Not a valid slash command")

            await interaction.deferReply()
            await slashcmd.run({ client, interaction })
        }
        handleCommand()
    })
    client.login(TOKEN)
}