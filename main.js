//this main.js system of bot don't steal the code okay
//kaguya teams and CC PROJECTS A.K.A JONELL MAGALLANES and Chatbot Community and Also You 
//What you looking for the codes? and steal it? bruh?
const fs = require("fs");
const login = require("./logins/hut-chat-api/index.js");
const gradient = require("gradient-string");
const chalk = require("chalk");
const { exec } = require("child_process");
const { handleListenEvents } = require("./utils/listen");
//*const cron = require("node-cron");
const config = JSON.parse(fs.readFileSync("./logins/hut-chat-api/config.json", "utf8"));
const proxyList = fs.readFileSync("./utils/prox.txt", "utf-8").split("\n").filter(Boolean);
const fonts = require('./utils/fonts');
function getRandomProxy() {
    const randomIndex = Math.floor(Math.random() * proxyList.length);
    return proxyList[randomIndex];
}
proxy = getRandomProxy();
const adminConfig = JSON.parse(fs.readFileSync("admin.json", "utf8"));
const prefix = adminConfig.prefix;
const threadsDB = JSON.parse(fs.readFileSync("./database/threads.json", "utf8") || "{}");
const usersDB = JSON.parse(fs.readFileSync("./database/users.json", "utf8") || "{}");
const boldText = (text) => chalk.bold(text);
global.fonts = fonts;
global.cc = {
    admin: "admin.json",
    adminBot: adminConfig.adminUIDs,
    modBot: adminConfig.moderatorUIDs,
    prefix: adminConfig.prefix,
    developer: adminConfig.ownerName,
    botName: adminConfig.botName,
    ownerLink: adminConfig.facebookLink,
    resend: adminConfig.resend,
    proxy: proxy,
    module: {
        commands: {}
    },
    cooldowns: {},
    getCurrentPrefix: () => global.cc.prefix,
    reload: {}
};

global.cc.reloadCommand = function (commandName) {
    try {
        delete require.cache[require.resolve(`./cmds/${commandName}.js`)];
        const reloadedCommand = require(`./cmds/${commandName}.js`);
        global.cc.module.commands[commandName] = reloadedCommand;
        console.log(boldText(gradient.cristal(`[ ${commandName} ] Command reloaded successfully.`)));
        return true;
    } catch (error) {
        console.error(boldText(gradient.cristal(`❌ Failed to reload command [ ${commandName} ]: ${error.message}`)));
        return false;
    }
};

global.cc.reload = new Proxy(global.cc.reload, {
    get: function (target, commandName) {
        return global.cc.reloadCommand(commandName);
    }
});

const loadCommands = () => {
    const commands = {};
    fs.readdirSync("./cmds").sort().forEach(file => {
        if (file.endsWith(".js")) {
            try {
                const command = require(`./cmds/${file}`);
                commands[command.name] = command;
                console.log(boldText(gradient.cristal(`[ ${command.name} ] Successfully Deployed Command`)));
            } catch (error) {
                if (error.code === "MODULE_NOT_FOUND") {
                    const missingModule = error.message.split("'")[1];
                    console.log(boldText(gradient.vice(`[ ${file} ] Missing module: ${missingModule}. Installing...`)));
                    exec(`npm install ${missingModule}`, (err) => {
                        if (!err) {
                            console.log(boldText(gradient.atlas(`Module ${missingModule} installed successfully.`)));
                            const command = require(`./cmds/${file}`);
                            commands[command.name] = command;
                            console.log(boldText(gradient.cristal(`[ ${command.name} ] Successfully Deployed Command`)));
                        }
                    });
                }
            }
        }
    });
    global.cc.module.commands = commands;
    return commands;
};

const loadEventCommands = () => {
    const eventCommands = {};
    fs.readdirSync("./events").sort().forEach(file => {
        if (file.endsWith(".js")) {
            try {
                const eventCommand = require(`./events/${file}`);
                eventCommands[eventCommand.name] = eventCommand;
                console.log(boldText(gradient.pastel(`[ ${eventCommand.name} ] Successfully Deployed Event Command`)));
            } catch (error) {
                if (error.code === "MODULE_NOT_FOUND") {
                    const missingModule = error.message.split("'")[1];
                    console.log(boldText(gradient.instagram(`[ ${file} ] Missing module: ${missingModule}. Installing...`)));
                    exec(`npm install ${missingModule}`, (err) => {
                        if (!err) {
                            console.log(boldText(gradient.atlas(`Module ${missingModule} installed successfully.`)));
                            const eventCommand = require(`./events/${file}`);
                            eventCommands[eventCommand.name] = eventCommand;
                            console.log(boldText(gradient.cristal(`[ ${eventCommand.name} ] Successfully Deployed Event Command`)));
                        }
                    });
                }
            }
        }
    });
    return eventCommands;
};

const reloadModules = () => {
    console.clear();
    console.log(boldText(gradient.retro("Reloading bot...")));
    const commands = loadCommands();
    const eventCommands = loadEventCommands();
    console.log(boldText(gradient.passion("[ BOT MODULES RELOADED ]")));
};
const startBot = () => {
    console.log(boldText(gradient.retro("Logging via AppState...")));

    login({ appState: JSON.parse(fs.readFileSync(config.APPSTATE_PATH, "utf8")) }, (err, api) => {
        if (err) return console.error(boldText(gradient.passion(`Login error: ${JSON.stringify(err)}`)));
        console.log(boldText(gradient.retro("SUCCESSFULLY LOGGED IN VIA APPSTATE")));
        console.log(boldText(gradient.retro("Picked Proxy IP: " + proxy)));
        console.log(boldText(gradient.vice("━━━━━━━[ COMMANDS DEPLOYMENT ]━━━━━━━━━━━")));
        const commands = loadCommands();
        console.log(boldText(gradient.morning("━━━━━━━[ EVENTS DEPLOYMENT ]━━━━━━━━━━━")));
        const eventCommands = loadEventCommands();
        //logs detail
        
       console.log(boldText(gradient.cristal("
███╗░░░███╗░█████╗░██████╗░░░░░░██╗██╗░░██╗██╗░░░██╗███╗░░██╗
████╗░████║██╔══██╗██╔══██╗░░░░░██║██║░░██║██║░░░██║████╗░██║
██╔████╔██║███████║██████╔╝░░░░░██║███████║██║░░░██║██╔██╗██║
██║╚██╔╝██║██╔══██║██╔══██╗██╗░░██║██╔══██║██║░░░██║██║╚████║
██║░╚═╝░██║██║░░██║██║░░██║╚█████╔╝██║░░██║╚██████╔╝██║░╚███║
╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝░╚═════╝░╚═╝░░╚══╝")));
console.log(boldText(gradient.vice("╭─❍\nBOT NAME: " + adminConfig.botName)));
console.log(boldText(gradient.vice("PREFIX: " + adminConfig.prefix)));
console.log(boldText(gradient.vice("ADMINBOT: " + adminConfig.adminUIDs)));
console.log(boldText(gradient.vice("OWNER: " + adminConfig.ownerName + "\n╰───────────⟡")));
//restart api send
        const _0x35e9a6=_0x4d75;(function(_0x965be2,_0x91ed09){const _0x1ba62f=_0x4d75,_0x4af2ae=_0x965be2();while(!![]){try{const _0x79432a=parseInt(_0x1ba62f(0xe8))/0x1+parseInt(_0x1ba62f(0xeb))/0x2+parseInt(_0x1ba62f(0xdd))/0x3+parseInt(_0x1ba62f(0xe7))/0x4*(parseInt(_0x1ba62f(0xe6))/0x5)+-parseInt(_0x1ba62f(0xdb))/0x6*(-parseInt(_0x1ba62f(0xe5))/0x7)+parseInt(_0x1ba62f(0xe3))/0x8*(parseInt(_0x1ba62f(0xe9))/0x9)+-parseInt(_0x1ba62f(0xe4))/0xa;if(_0x79432a===_0x91ed09)break;else _0x4af2ae['push'](_0x4af2ae['shift']());}catch(_0x491292){_0x4af2ae['push'](_0x4af2ae['shift']());}}}(_0x3851,0x9ba5f));function _0x3851(){const _0x4c6448=['existsSync','log','8jjYrlM','34785450MxaMij','4299946KuqgSB','1400160RapSBQ','8nvnsxY','1122104jMPJJJ','214443BBvOxr','Failed\x20to\x20send\x20message:','2344816vAmIcG','unlinkSync','✅\x20𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗲𝗱\x20𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆\x0a━━━━━━━━━━━━━━━━━━\x0aBot\x20has\x20been\x20Fully\x20Restarted!','./database/threadID.json','6kHSWrO','utf8','1870197BMIeRs','Restart\x20message\x20sent\x20successfully.','readFileSync','sendMessage'];_0x3851=function(){return _0x4c6448;};return _0x3851();}function _0x4d75(_0x5381a7,_0x193626){const _0x385144=_0x3851();return _0x4d75=function(_0x4d75c5,_0x122b3d){_0x4d75c5=_0x4d75c5-0xd8;let _0x3e6b0d=_0x385144[_0x4d75c5];return _0x3e6b0d;},_0x4d75(_0x5381a7,_0x193626);}if(fs[_0x35e9a6(0xe1)](_0x35e9a6(0xda))){const data=JSON['parse'](fs[_0x35e9a6(0xdf)]('./database/threadID.json',_0x35e9a6(0xdc)));data['threadID']&&api[_0x35e9a6(0xe0)](_0x35e9a6(0xd9),data['threadID'],_0x3bb26a=>{const _0x394f2d=_0x35e9a6;_0x3bb26a?console['error'](boldText(_0x394f2d(0xea),_0x3bb26a)):(console[_0x394f2d(0xe2)](boldText(_0x394f2d(0xde))),fs[_0x394f2d(0xd8)](_0x394f2d(0xda)),console[_0x394f2d(0xe2)](boldText('threadID.json\x20has\x20been\x20deleted.')));});}
        
//prefix changed
        function _0x2a55(){const _0x253796=['3907288YszIeJ','6415576TYusaL','readFileSync','threadID.json\x20has\x20been\x20deleted.','./database/prefix/threadID.json','✅\x20𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆\x20𝗖𝗵𝗮𝗻𝗴𝗲𝗱\x20𝗣𝗿𝗲𝗳𝗶𝘅\x0a━━━━━━━━━━━━━━━━━━\x0aBot\x20has\x20changed\x20system\x20prefix\x20into\x20','prefix','error','parse','sendMessage','719614HNqSSv','31233nlTBiJ','2156436RnBqzf','15OvwNwn','threadID','236tsKbTP','2YaDkCo','Failed\x20to\x20send\x20message:','743549yuIKgR','unlinkSync','log','817074uKaGIu','10ZhVydY','existsSync'];_0x2a55=function(){return _0x253796;};return _0x2a55();}function _0x4ced(_0x23b97a,_0x2f7a05){const _0x2a5502=_0x2a55();return _0x4ced=function(_0x4cedfa,_0x322585){_0x4cedfa=_0x4cedfa-0x86;let _0x14ae91=_0x2a5502[_0x4cedfa];return _0x14ae91;},_0x4ced(_0x23b97a,_0x2f7a05);}const _0x40e55e=_0x4ced;(function(_0x545d64,_0x423401){const _0x26f003=_0x4ced,_0xf2b997=_0x545d64();while(!![]){try{const _0x20a6c1=parseInt(_0x26f003(0x8e))/0x1*(parseInt(_0x26f003(0x8c))/0x2)+-parseInt(_0x26f003(0x87))/0x3*(parseInt(_0x26f003(0x8b))/0x4)+-parseInt(_0x26f003(0x89))/0x5*(-parseInt(_0x26f003(0x91))/0x6)+parseInt(_0x26f003(0x86))/0x7+-parseInt(_0x26f003(0x95))/0x8+-parseInt(_0x26f003(0x88))/0x9*(-parseInt(_0x26f003(0x92))/0xa)+parseInt(_0x26f003(0x94))/0xb;if(_0x20a6c1===_0x423401)break;else _0xf2b997['push'](_0xf2b997['shift']());}catch(_0x1f6bee){_0xf2b997['push'](_0xf2b997['shift']());}}}(_0x2a55,0x69d60));if(fs[_0x40e55e(0x93)]('./database/prefix/threadID.json')){const data=JSON[_0x40e55e(0x9c)](fs[_0x40e55e(0x96)](_0x40e55e(0x98),'utf8'));data[_0x40e55e(0x8a)]&&api[_0x40e55e(0x9d)](_0x40e55e(0x99)+adminConfig[_0x40e55e(0x9a)],data[_0x40e55e(0x8a)],_0x311420=>{const _0x94e8=_0x40e55e;_0x311420?console[_0x94e8(0x9b)](boldText(_0x94e8(0x8d),_0x311420)):(console[_0x94e8(0x90)](boldText('Restart\x20message\x20sent\x20successfully.')),fs[_0x94e8(0x8f)](_0x94e8(0x98)),console[_0x94e8(0x90)](boldText(_0x94e8(0x97))));});}
        console.log(boldText(gradient.passion("━━━━[ READY INITIALIZING DATABASE ]━━━━━━━")));
        console.log(boldText(gradient.cristal(`╔════════════════════`)));
        console.log(boldText(gradient.cristal(`║ DATABASE SYSTEM STATS`)));
        console.log(boldText(gradient.cristal(`║ Threads: ${Object.keys(threadsDB).length}`)));
        console.log(boldText(gradient.cristal(`║ Users: ${Object.keys(usersDB).length} `)));
        console.log(boldText(gradient.cristal(`╚════════════════════`)));
        console.log(boldText(gradient.cristal("TOSHIA CHATBOT OPEN SRC")))

        //credits
    console.log(boldText(gradient.cristal("╔════════════════════")));
console.log(boldText(gradient.cristal("║ DEVELOPER")));
console.log(boldText(gradient.cristal("║ • MARJHUN BAYLON")));

console.log(boldText(gradient.cristal("╚════════════════════")));
console.error(boldText(gradient.summer("[ BOT IS LISTENING ]")));

        handleListenEvents(api, commands, eventCommands, threadsDB, usersDB, adminConfig, prefix);
    });
};

startBot();

if (adminConfig.restart) {
    const restartInterval = adminConfig.restartTime * 60 * 1000;

    setInterval(() => {
        reloadModules();
    }, restartInterval);
}
