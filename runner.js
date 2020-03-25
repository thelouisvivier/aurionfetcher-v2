const credFetcher = require('./core/credFetcher.js')
const eventsFetcher = require('./core/eventsFetcher.js')
const eventsFormatter = require('./core/eventsFormatter.js')
const eventsSync = require('./core/eventsSync.js')
const notify = require('./core/notify.js')
const server = require('./core/server.js')
const configChecker = require('./core/configChecker.js')
const config = require('./config/config.json')

var trail = {};

async function runner() {
    console.log(new Date());
    try {
        await credFetcher(trail);
    }
    catch(error) {
        console.error(error+"\nTrying again in 20min");
        notify.onError(error);
        setTimeout(runner,1200*1000);//20min
        return;
    }
    try {
        await eventsFetcher(trail);
    }
    catch(error) {
        console.error(error+"\nTrying again in 20min");
        notify.onError(error);
        setTimeout(runner,1200*1000);//20min
        return;
    }
    try {
        await eventsFormatter(trail);
    }
    catch(error) {
        console.error(error+"\nTrying again in 20min");
        notify.onError(error);
        setTimeout(runner,1200*1000);//20min
        return;
    }
    try {
        await eventsSync(trail);
    }
    catch(error) {
        console.error(error+"\nTrying again in 20min");
        notify.onError(error);
        setTimeout(runner,1200*1000);//20min
        return;
    }
    try {
        await notify.onSync(trail);
    }
    catch(error) {
        console.error(error+"\nTrying again in 20min");
        notify.onError(error);
        setTimeout(runner,1200*1000);//20min
        return;
    }
    console.log("          Going to sleep for "+config.refreshInterval+" seconds");
    setTimeout(runner, config.refreshInterval*1000);
}

try {
    server();
}
catch(error) {
    console.error(error);
    process.exit(1);
}

try {
    configChecker();
}
catch(error) {
    console.error(error);
    process.exit(1);
}

notify.onBoot();

runner();
