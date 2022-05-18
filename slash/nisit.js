const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const axios = require("axios")
const cheerio = require("cheerio");

module.exports = {
	data: new SlashCommandBuilder()
            .setName("nisit")
            .setDescription("Sand box for server info")
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("studen")
                    .setDescription("Loads a single song from a url")
                    .addStringOption((option) => option.setName("id").setDescription("the studen id").setRequired(true))
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("transcript")
                    .setDescription("Loads a single song from a url")
                    .addStringOption((option) => option.setName("tranid").setDescription("the studen id").setRequired(true))
            ),
	run: async ({ client, interaction }) => {
        if (interaction.options.getSubcommand() === "studen") {
            let id = interaction.options.getString("id")
            await axios.get(`http://nisit-ku.ku.ac.th/WebForm_Index_Report.aspx?stdid=${id}&h=0`)
                .then(async ({ data }) => {
                    try{
                        const transcript = data.split('<span id=\"LabelSTD_IDNO\">')[1].split('<table style="WIDTH: 820px; HEIGHT: 75px"')[0]
                        const lines = transcript.split('<font color="Blue">')
                        let student = []
                        let countID = 0
                        await lines.map(line => {
                            const lineSplit = line.split('</font>')
                            const lineText = lineSplit[0]
                            if (lineText.length > 1) {
                                if (lineText != '' || lineText != null || lineText != undefined) {
                                    countID++
                                    student.push({
                                        id: countID,
                                        text: lineText,
                                    })
                                }
                            }
                        });
                        if(student.length > 0) {
                            interaction.editReply({
                                embeds: [
                                    new MessageEmbed()
                                        .setTitle(`ข้อมูลนักศึกษา`)
                                        .setDescription(`รหัสนักศึกษา: ${student[0].text}`)
                                        .addField("ชื่อ-สกุล", student[1].text)
                                        .addField("สาขา", student[3].text)
                                        .addField("คณะ", student[2].text)
                                        .addField("วิทยาเขต", student[5].text)
                                        .addField("สถานะ", student[4].text)
                                        .setColor(0x00AE86)
                                ]
                            })
                        }else{
                            interaction.editReply({
                                embeds: [
                                    new MessageEmbed()
                                        .setTitle(`ข้อมูลนักศึกษา`)
                                        .setDescription(`ไม่พบข้อมูลนักศึกษารหัส ${id}`)
                                ]
                            })
                        }
                    }catch{
                        interaction.editReply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle(`ข้อมูลนักศึกษา`)
                                    .setDescription(`ไม่พบข้อมูลนักศึกษารหัส ${id}`)
                            ]
                        })
                    }
                    
                });
        }
        if (interaction.options.getSubcommand() === "transcript") {
            const tranid = interaction.options.getString("tranid")
            const title_table = [];
            async function scrapeData(url) {
                try {
                    const { data } = await axios.get(url, {timeout: 30000});
                    const $ = cheerio.load(data);
                    const title = $("#_ctl0 > p:nth-child(486) > strong > u > font > table > tbody");
                    let count = 0;
                    await title.each((i, el) => {
                        let col0 = ""; let col1 = ""; let col2 = ""; let col3 = ""; let col4 = "";
                        for(let i = 0; i < $(el).children().length; i++) {
                            col0 = $(el).children().eq(i).children().eq(0).text().replace(/\s/g, "");
                            col1 = $(el).children().eq(i).children().eq(1).text().replace(/\s/g, "");
                            col2 = $(el).children().eq(i).children().eq(2).text().replace(/\s/g, "");
                            col3 = $(el).children().eq(i).children().eq(3).text().replace(/\s/g, "");
                            col4 = $(el).children().eq(i).children().eq(4).text().replace(/\s/g, "");
                            title_table.push({
                                id: count,
                                title: col0,
                                projects: col1,
                                workingGroups: col2,
                                activities: col3,
                                hours: col4
                            });
                            count++;
                        }
                    });
                } catch (err) {
                    if (err.code === 'ECONNABORTED') {
                        await interaction.editReply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle(`ข้อมูลนักศึกษา`)
                                    .setDescription(`Timeout เนื่่องจากไม่สามารถดึงข้อมูลได้`)
                            ]
                        })
                    }
                }
            }
            await scrapeData(`http://nisit-ku.ku.ac.th/WebForm_report_std_B3.aspx?stdid=${tranid}&link=1`);
       
            for (let i = 0; i < title_table.length; i++) {
                if (title_table[i].id == 8) {
                    let title = await title_table[i].title;
                    let projects = await title_table[i].projects;
                    let workingGroups = await title_table[i].workingGroups;
                    let activities = await title_table[i].activities;
                    let hours = await title_table[i].hours;
                    await interaction.editReply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle(`ข้อมูลการศึกษา`)
                                .setDescription(`รหัสนักศึกษา: ${tranid}`)
                                .addField("หัวข้อการศึกษา", title)
                                .addField("จำนวนโครงการที่ได้รับ", projects)
                                .addField("กิจกรรมที่เข้าร่วม", activities)
                                .addField("ชั่วโมงที่ได้รับ", hours)
                                .addField("วันที่ปรับปรุงข้อมูล", new Date().toLocaleString())
                                .setColor(0x00AE86)
                        ]
                    })
                }
            }
        }
    },
}