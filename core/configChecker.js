const config = require('../config/config.json')

module.exports = function(trail){
    if (config.username == ""){
        throw new Error("config.json : Empty username");
    }
    if (config.password == ""){
        throw new Error("config.json : Empty password");
    }
    if (config.domain == ""){
        throw new Error("config.json : Empty domain");
    }
    if (config.telegramBotToken == ""){
        throw new Error("config.json : Empty telegramBotToken");
    }
    if (config.telegramChatId == ""){
        throw new Error("config.json : Empty telegramChatId");
    }
    console.log("Config file checked");
    return true;
};