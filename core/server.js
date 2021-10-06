const express = require('express');
const app = express();
const path = require('path')
const config = require('../config/config.json')

module.exports = async function () {
  app.get(encodeURI('/aurionfetcher/'+config.username+'/suscribe'), (req, res) => {

      res.set('Content-Type', 'text/calendar;charset=utf-8');
      res.set('Content-Disposition', 'attachment; filename="events.ics"');
      res.sendFile(path.join(__dirname, '../data', 'events.ics'));
  });

  const port = config.port;
  app.listen(port);
    console.log("Server started at "+port);
};
``
