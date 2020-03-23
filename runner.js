const credFetcher = require('./core/credFetcher.js')
const eventsFetcher = require('./core/eventsFetcher.js')
const eventsFormater = require('./core/eventsFormater.js')
const eventsSync = require('./core/eventsSync.js')
const notify = require('./core/notify.js')
const server = require('./core/server.js')
const config = require('./config/config.json')

var trail = {};

async function runner() {
    await credFetcher(trail);
    await eventsFetcher(trail);
    await eventsFormater(trail);
    await eventsSync(trail);
    await notify.onSync(trail);
    setTimeout(runner, config.refreshInterval*1000);
}
server();
notify.onBoot();
runner();
