process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const config = require('../config/config.json');

module.exports = {

  onSync : async function (trail) {
    const bot = new TelegramBot(config.telegramBotToken);
    let now = new Date();
    if (trail.editedEvents.length !== 0 || trail.addedEvents.length !== 0 || now.getHours() === 23){
      //Stats message
      let message1 = "🤖📆"+trail.fetchedEventsNbr+"✏️"+trail.editedEvents.length+"➕"+trail.addedEvents.length;
      await bot.sendMessage(config.telegramChatId, message1);

      //Message fo edited events
      if (trail.editedEvents.length !== 0){
        for (const editedEvent of trail.editedEvents){
          let message2 = "✏️Edited\n"+editedEvent.title+"\n"+dateFormatter(editedEvent.start,editedEvent.end)+"\nEn "+editedEvent.location+" par "+editedEvent.description;
          await bot.sendMessage(config.telegramChatId, message2);
        }
        console.log("          Notifications sent !");
      }

      //Message for new events
      if(trail.addedEvents.length !== 0){
        for (const addedEvent of trail.addedEvents){
          let message3 = "➕Added\n"+addedEvent.title+"\n"+dateFormatter(addedEvent.start,addedEvent.end)+"\nEn "+addedEvent.location+" par "+addedEvent.description;
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
    let message = "<b>🤖BIP BIP AurionFetcher has encountered an ERROR</b>"+"\n😱😱😱 Trying again in 20 minutes"+"\n🙂FYI, here the error the system send me : "+error;
    await bot.sendMessage(config.telegramChatId, message,{parse_mode: 'HTML'});
    return true;
  }

};

function dateFormatter(start,end){
  let ye = start[0];
  let mo = ("0"+(start[1])).slice(-2);
  let da = ("0" + start[2]).slice(-2);
  let sho = ("0" + start[3]).slice(-2);
  let smin = ("0" + start[4]).slice(-2);
  let eho = ("0" + end[3]).slice(-2);
  let emin = ("0" + end[4]).slice(-2);

  return(`${da}/${mo}/${ye} de ${sho}h${smin} à ${eho}h${emin}`);
}
