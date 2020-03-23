const TelegramBot = require('node-telegram-bot-api');
const config = require('../config/config.json');

module.exports = {

  onSync : async function (trail) {
    const bot = new TelegramBot(config.telegramBotToken);
    let now = new Date();
    if (trail.editedEvents.length != 0 || trail.addedEvents.length != 0 || now.getHours() == 23){
      let message1 = "🤖📆"+trail.fetchedEventsNbr+"✏️"+trail.editedEvents.length+"➕"+trail.addedEvents.length;
      await bot.sendMessage(config.telegramChatId, message1);
      if (trail.editedEvents.length != 0){
        for (const editedEvent of trail.editedEvents){
          let message2 = "✏️Edited\n"+editedEvent.title+"\n"+editedEvent.start[2]+"/"+editedEvent.start[1]+"/"+editedEvent.start[0]+" de "+(editedEvent.start[3]+1)+":"+editedEvent.start[4]+" à "+(editedEvent.end[3]+1)+":"+editedEvent.end[4]+"\nEn "+editedEvent.location+" par "+editedEvent.description;
          await bot.sendMessage(config.telegramChatId, message2);
        }
        console.log("          Notifications sent !");
      }
      if(trail.addedEvents.length != 0){
        for (const addedEvent of trail.addedEvents){
          let message3 = "➕Added\n"+addedEvent.title+"\n"+addedEvent.start[2]+"/"+addedEvent.start[1]+"/"+addedEvent.start[0]+" de "+(addedEvent.start[3]+1)+":"+addedEvent.start[4]+" à "+(addedEvent.end[3]+1)+":"+addedEvent.end[4]+"\nEn "+addedEvent.location+" par "+addedEvent.description;
          await bot.sendMessage(config.telegramChatId, message3);
        }
        console.log("          Notifications sent !");
      }
    }
    return true;
  },

  onBoot : async function (){
    const bot = new TelegramBot(config.telegramBotToken);
    let message = "<b>🤖BIP BIP AurionFetcher has started</b>"+"\n⏰ Going to refresh every "+config.refreshInterval+" seconds"+"\n📲 Subscription URL : "+"http://domain.tld:"+config.port+"/aurionfetcher/"+config.username+"/suscribe/";
    await bot.sendMessage(config.telegramChatId, message,{parse_mode: 'HTML'});
    return true;
  },

  onError : async function(error){
    const bot = new TelegramBot(config.telegramBotToken);
    let message = "<b>🤖BIP BIP AurionFetcher has encountered an ERROR</b>"+"\n😱😱😱 Trying again in 20 minutes"+"\n🙂For your information, here the error the system send me : "+error;
    await bot.sendMessage(config.telegramChatId, message,{parse_mode: 'HTML'});
    return true;
  }

};
