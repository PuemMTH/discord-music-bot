const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const axios = require("axios")
const cheerio = require("cheerio");

module.exports = {
	data: new SlashCommandBuilder()
            .setName("math")
            .setDescription("Sand box for server info")
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("stat8")
                    .setDescription("Loads a math stat 8")
                    .addStringOption((option) => option.setName("table").setDescription("ข้อมูล1,ข้อมูล2....ข้อมูลn;nแถวที่1,nแถวที่1...nแถวที่n").setRequired(true))
            ),
            
	run: async ({ client, interaction }) => {
        if (interaction.options.getSubcommand() === "stat8") {
            let table = interaction.options.getString("table")
            // 2.8,3.9,4.1,3.0,4.3,3.7,4.0,3.5,4.4,3.6,4.2,3.8;4,4,4
            let table2 = table.split(";")
            // let input_string = "2.8,3.9,4.1,3.0,4.3,3.7,4.0,3.5,4.4,3.6,4.2,3.8";
            // let columns = "4,4,4"
            let input_string = table2[0]
            let columns = table2[1]
            try{
            
                // split and convert to float
                let input_array = input_string.split(",").map(Number);
            
                // count columns
                let columns_array = columns.split(",").map(Number);
            
                // Sort by each column #paramitor 
                let countCol = 0;
                let Row = [];
                for(let i = 0; i < columns_array.length; i++){
                    let cut_input_array = input_array.slice(countCol, countCol + columns_array[i]);
                    Row.push(cut_input_array);
                    countCol += columns_array[i];
                }
                // end
            
                // plus one to the each column
                let sumRow = Row.map(x => {
                  let sum = x.reduce((a, b) => {
                      return (a + b);
                  }, 0);
                  return parseFloat(sum.toFixed(4));
                });
                // end
            
                // sum each floot in array
                let sum = input_array.reduce((a, b) => a + b, 0);
            
                let average = sum / input_array.length;
                let pow_array_string = input_array.map(x => (x*x).toFixed(2));
                let pow_array_floot = pow_array_string.map(Number);
                // let pow_sum = pow_array.reduce((a, b) => a + b, 0);
            
                let t = input_array.reduce((a, b) => (a + b), 0);
                let sumPowTwo = parseFloat(Math.pow(sum,2).toFixed(4))
                let Ct = parseFloat((sumPowTwo / input_array.length).toFixed(4))
            
                let return_value = []; 
                for(let i = 0; i < sumRow.length; i++){
                    let SSb = (Math.pow(sumRow[i], 2)/ columns_array[i]);
                    return_value.push(parseFloat(SSb.toFixed(4)));
                }
            
                // console.log(input_array);
                // console.log(columns_array);
                // console.log(Row);
                // console.log(sumRow);
                // console.log(`sumPowTwo: ${pow_array_floot.reduce((a, b) => a + b, 0) } || Ct: ${Ct}`);

                // sumPowTwo
                let SSt = parseFloat(((pow_array_floot.reduce((a, b) => a + b, 0)) - Ct));
                let SSb = (return_value.reduce((a, b) => a + b, 0)) - Ct;
            
                // SSt fix 4 decimal
                BeSSt = parseFloat(SSt.toFixed(4));
                BeSSb = parseFloat(SSb.toFixed(4));
                SSw = BeSSt - BeSSb;
                let MSb = BeSSb / (columns_array.length - 1);
                let MSw = parseFloat((SSw / (input_array.length - columns_array.length)).toFixed(4));
                let F = parseFloat((MSb / MSw).toFixed(4));
            
                // Math Stat
                // console.table({
                //       Input: input_array,
                //       pow2: pow_array_floot,
                //       n: input_array.length,
                //       t: t,
                //       Ct: Ct,
                //       After_SSt: SSt,
                //       After_SSb: SSb,
                //       Before_SSt: BeSSt,
                //       Before_SSb: BeSSb,
                //       SSw: SSw,
                //       MSb: MSb,
                //       MSw: MSw,
                //       F: F
                // })

                await interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`คำตอบของคุณ`)
                            .setDescription(`ข้อมูล: ${input_array}\n แบ่งตามคอลัม: ${columns_array} \n จำนวนข้อมูล: ${input_array.length} \n ข้อมูลกำลัง 2: ${pow_array_floot}`)
                            .addField("ค่าของ Ct ", `${Ct}`)
                            .addField("ค่าของ SSt ", `${BeSSt}`)
                            .addField("ค่าของ SSb ", `${BeSSb}`)
                            .addField("ค่าของ SSw ", `${SSw}`)
                            .addField("ค่าของ MSb ", `${MSb}`)
                            .addField("ค่าของ MSw ", `${MSw}`)
                            .addField("ค่าของ F ", `${F}`)
                            .setThumbnail(`https://avatars.githubusercontent.com/u/59855164?s=400&u=025e910a15293edb8a5cea93badc8ee01ce0784d&v=4`)
                            .setColor("#00ff00")
                        ]
                })
            }catch{
                await interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`จะใช้บอทหัดดูวิธีใช้ก่อนซะบ้างงงง`)
                            .setDescription(`พิมพ์แบบนี้ \nข้อมูล1,ข้อมูล2....ข้อมูลn;nแถวที่1,nแถวที่1...nแถวที่n\n ยกตัวอย่าง 1,22,33,44,55,22,43,44,55,66,77,88;4,4,4`)
                            .setThumbnail(`https://avatars.githubusercontent.com/u/59855164?s=400&u=025e910a15293edb8a5cea93badc8ee01ce0784d&v=4`)
                            .setColor("#ff0000")
                        ]
                })
            }
        }
    }
}