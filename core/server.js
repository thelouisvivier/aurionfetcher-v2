const express = require('express');
const app = express();
const path = require('path')
const config = require('../config/config.json')

module.exports = async function () {
  app.get('/aurionfetcher/'+config.username+'/suscribe', (req, res) => {
      // for demo purpose just create iCal on the fly
      //let iCal = ics.createNew('iCal Demo by Shaun Calendar', null, null, null, '-//Shaun Xu//NONSGML iCal Demo Calendar//EN');
      //let iCalString = iCal.toICSString();

      res.set('Content-Type', 'text/calendar;charset=utf-8');
      res.set('Content-Disposition', 'attachment; filename="events.ics"');
      res.sendFile(path.join(__dirname, '../data', 'events.ics'));
  });

  const port = config.port;
  app.listen(port);
  console.log(`Application started at ${port}`);
};
