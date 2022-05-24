const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
            .setName("math")
            .setDescription("Sand box for server info")
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("stat8")
                    .setDescription("Loads a math stat 8 & 9")
                    .addStringOption((option) => option.setName("table").setDescription("ข้อมูล1,ข้อมูล2....ข้อมูลn;nแถวที่1,nแถวที่2...nแถวที่n").setRequired(true))
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("stat9")
                    .setDescription("Loads a math stat 8 & 9")
                    .addStringOption((option) => option.setName("table").setDescription("ข้อมูล1,ข้อมูล2....ข้อมูลn;nแถวที่1,nแถวที่2...nแถวที่n").setRequired(true))
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
                SSw = parseFloat((BeSSt - BeSSb).toFixed(4));
                let MSb = BeSSb / (columns_array.length - 1);
                let MSw = parseFloat((SSw / (input_array.length - columns_array.length)).toFixed(4));
                let F = parseFloat((MSb / MSw).toFixed(4));

                let DFb = `${columns_array.length} - 1 = ${columns_array.length - 1}`;
                let DFw = `${input_array.length} - ${columns_array.length} = ${input_array.length - columns_array.length}`;
            
                // Math Stat
                console.table({
                    Input: input_array,
                    pow2: pow_array_floot,
                    n: input_array.length,
                    t: t,
                    Ct: Ct,
                    After_SSt: SSt,
                    After_SSb: SSb,
                    Before_SSt: BeSSt,
                    Before_SSb: BeSSb,
                    DFb: DFb,
                    DFw: DFw,
                    SSw: SSw,
                    MSb: MSb,
                    MSw: MSw,
                    F: F
                })

                await interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`ใช้ในการเช็คคำตอบเท่านั้น ใช้ในบทที่ 8`)
                            .setDescription(`ข้อมูล: ${input_array} \nข้อมูล^2: ${pow_array_floot} \nแบ่งตามคอลัม: ${columns_array} \nจำนวนข้อมูล: ${input_array.length}`)
                            .addField("ค่าของ Ct", `${Ct}`, true)
                            .addField("ค่าของ SSt", `${BeSSt}`, true)
                            .addField("ค่าของ SSb", `${BeSSb}`, true)
                            .addField("ค่าของ SSw", `${SSw}`, true)
                            .addField("ค่าของ DFb k-1", `${DFb}`, true)
                            .addField("ค่าของ DFw n-k", `${DFw}`, true)
                            .addField("ค่าของ MSb ", `${MSb}`, true)
                            .addField("ค่าของ MSw ", `${MSw}`, true)
                            .addField("ค่าของ F ", `${F}`, true)
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
        if (interaction.options.getSubcommand() === "stat9"){
            try{
                let OiPi = interaction.options.getString("table")
                // let OiPi = "52,58,60,55,40,35;0.166666667,0.166666667,0.166666667,0.166666667,0.166666667,0.166666667";
                let Oi = OiPi.split(";")[0].split(",").map(Number);
                let Pi = OiPi.split(";")[1].split(",").map(Number);
                let N = Oi.length;
                
                let OiSum = parseFloat(Oi.reduce((a, b) => a + b, 0).toFixed(4));
                let Ei = [];
                let ThinkEi = [];
                let OiDeleteEi = [];
                let ThinkOiDeleteEi = [];
                let OiDeleteEiPow2 = [];
                let ThinkOiDeleteEiPow2 = [];
                let OiDeleteEiPow2DivideEi = [];
                let ThinkOiDeleteEiPow2DivideEi = [];
                    
                for (let i = 0; i < N; i++) {
                  Ei[i] = parseFloat((OiSum * Pi[i]).toFixed(4));
                  ThinkEi[i] = `${String.fromCharCode(i + 97)}: ${OiSum} * ${Pi[i]} = ${(OiSum * Pi[i]).toFixed(4)}`;
                }
                    
                for (let i = 0; i < N; i++) {
                  OiDeleteEi[i] = parseFloat((Oi[i] - Ei[i]).toFixed(4));
                  ThinkOiDeleteEi[i] = `${String.fromCharCode(i + 97)}: ${Oi[i]} - ${Ei[i]} = ${(Oi[i] - Ei[i]).toFixed(4)}`;
                }
                    
                for (let i = 0; i < N; i++) {
                  OiDeleteEiPow2[i] = parseFloat((OiDeleteEi[i] * OiDeleteEi[i]).toFixed(4));
                  ThinkOiDeleteEiPow2[i] = `${String.fromCharCode(i + 97)}: ${OiDeleteEi[i]} * ${OiDeleteEi[i]} = ${(OiDeleteEi[i] * OiDeleteEi[i]).toFixed(4)}`;
                }
                    
                for (let i = 0; i < N; i++) {
                  OiDeleteEiPow2DivideEi[i] = parseFloat((OiDeleteEiPow2[i] / Ei[i]).toFixed(4));
                  ThinkOiDeleteEiPow2DivideEi[i] = `${String.fromCharCode(i + 97)}: ${OiDeleteEiPow2[i]} / ${Ei[i]} = ${(OiDeleteEiPow2[i] / Ei[i]).toFixed(4)}`;
                }

                let SumOiDeleteEiPow2DivideEi = parseFloat(OiDeleteEiPow2DivideEi.reduce((a, b) => a + b, 0).toFixed(4));
                
                // console.table({
                //   Oi,
                //   Pi,
                //   Ei,
                //   OiDeleteEi,
                //   OiDeleteEiPow2,
                //   OiDeleteEiPow2DivideEi
                // });
                    
                // console.log(ThinkEi);
                // console.log(ThinkOiDeleteEi);
                // console.log(ThinkOiDeleteEiPow2);
                // console.log(ThinkOiDeleteEiPow2DivideEi);

                let respon = new MessageEmbed()
                await respon.setTitle(`ใช้ในการเช็คคำตอบเท่านั้น ใช้ในบทที่ 9`)
                // await respon.addField("ค่าของ Oi ", `${Oi}`, true)
                // await respon.setDescription(`คำตอบที่ถูกต้องคือ \n${ThinkEi.join("\n")}`)
                await respon.addField("ค่าของ Ei ", `\n${ThinkEi.join("\n")}`, false)
                await respon.addField("ค่าของ Oi - Ei ", `\n${ThinkOiDeleteEi.join("\n")}`, false)
                await respon.addField("ค่าของ (Oi - Ei)^2 ", `\n${ThinkOiDeleteEiPow2.join("\n")}`, false)
                await respon.addField("ค่าของ (Oi - Ei)^2 / Ei ", `\n${ThinkOiDeleteEiPow2DivideEi.join("\n")}`, false)
                await respon.addField("ค่าของ X^2 ", `\n${SumOiDeleteEiPow2DivideEi}`, false)
                await respon.setThumbnail(`https://avatars.githubusercontent.com/u/59855164?s=400&u=025e910a15293edb8a5cea93badc8ee01ce0784d&v=4`)
                await respon.setColor("#00ff00")
                await interaction.editReply({
                    embeds: [respon]
                })
              
              }catch{
                await interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(`จะใช้บอทหัดดูวิธีใช้ก่อนซะบ้างงงง`)
                            .setDescription(`พิมพ์แบบนี้ \nข้อมูล1,ข้อมูล2....ข้อมูลn;nแถวที่1,nแถวที่1...nแถวที่n\n ยกตัวอย่าง 52,58,60,55,40,35;0.1,0.1,0.1,0.1,0.1,0.1`)
                            .setThumbnail(`https://avatars.githubusercontent.com/u/59855164?s=400&u=025e910a15293edb8a5cea93badc8ee01ce0784d&v=4`)
                            .setColor("#ff0000")
                        ]
                })
              }
        }
    }
}