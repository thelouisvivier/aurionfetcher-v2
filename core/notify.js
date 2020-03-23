const TelegramBot = require('node-telegram-bot-api');
const config = require('../config/config.json');

module.exports = async function (trail) {
  console.log("Starting notification...");

  const bot = new TelegramBot(config.telegramBotToken);
  let now = new Date();
  if (trail.editedEvents.length != 0 || trail.addedEvents.length != 0 || now.getHours() == 23){
    let message1 = "🤖📆"+trail.fetchedEventsNbr+"✏️"+trail.editedEvents.length+"➕"+trail.addedEvents.length;
    bot.sendMessage(config.telegramChatId, message1);
    if (trail.editedEvents.length != 0){
      for (const editedEvent of trail.editedEvents){
        let message2 = "✏️Edited\n"+editedEvent.title+"\n"+editedEvent.start[2]+"/"+editedEvent.start[1]+"/"+editedEvent.start[0]+" de "+(editedEvent.start[3]+1)+":"+editedEvent.start[4]+" à "+(editedEvent.end[3]+1)+":"+editedEvent.end[4]+"\nEn "+editedEvent.location+" par "+editedEvent.description;
        bot.sendMessage(config.telegramChatId, message2);
      }
    }
    if(trail.addedEvents.length != 0){
      for (const addedEvent of trail.addedEvents){
        let message3 = "➕Added\n"+addedEvent.title+"\n"+addedEvent.start[2]+"/"+addedEvent.start[1]+"/"+addedEvent.start[0]+" de "+(addedEvent.start[3]+1)+":"+addedEvent.start[4]+" à "+(addedEvent.end[3]+1)+":"+addedEvent.end[4]+"\nEn "+addedEvent.location+" par "+addedEvent.description;
        bot.sendMessage(config.telegramChatId, message3);
      }
    }
  }
  console.log("Notifications sent !");
  return true;
};
