const ical = require('node-ical')
const ics = require('ics')
const {writeFileSync} = require('fs')
const config = require('../config/config.json')

module.exports = async function (trail) {
  const icsEvents = ical.sync.parseFile('data/events.ics');

  trail.fetchedEventsNbr = trail.formattedEvents.length;
  trail.editedEvents = new Array();
  trail.addedEvents = new Array();

  //If .ics file is not empty
  if (Object.keys(icsEvents).length > 0){
    let eventsToSync = new Array();

    let alarm;
    if(config.alarm){
      alarm = [{action: 'display', trigger: {minutes: config.xMinutesBeforeEventAlarm, before: true }}];
    }
    else{
      alarm = [];
    }

    for (const icsEvent of Object.values(icsEvents)) {
      let icsStart = new Date(icsEvent.start.toISOString());
      let icsEnd = new Date(icsEvent.end.toISOString());

      for (const eventToAdd of trail.formattedEvents){
        let start = new Date(eventToAdd.start);
        let end = new Date(eventToAdd.end);

        //Loop on unchecked events
        if (typeof(eventToAdd.checked) == 'undefined'){
          if (start.getTime() == icsStart.getTime() && end.getTime() == icsEnd.getTime() && icsEvent.summary == eventToAdd.course){

            //Unmodified event
            if(icsEvent.description == eventToAdd.teacher &&  icsEvent.location == eventToAdd.location){
              let tmp = {start:[icsStart.getFullYear(),icsStart.getMonth()+1,icsStart.getDate(),icsStart.getHours(),icsStart.getMinutes()], end:[icsEnd.getFullYear(),icsEnd.getMonth()+1,icsEnd.getDate(),icsEnd.getHours(),icsEnd.getMinutes()], title:icsEvent.summary ,location:icsEvent.location, description:icsEvent.description,alarms:alarm, productId:"AurionFetcherJS", uid:icsEvent.uid};
              eventsToSync.push(tmp);
              eventToAdd.checked = true;
            }

            //Edited event
            else {
              let tmp = {start:[icsStart.getFullYear(),icsStart.getMonth()+1,icsStart.getDate(),icsStart.getHours(),icsStart.getMinutes()], end:[icsEnd.getFullYear(),icsEnd.getMonth()+1,icsEnd.getDate(),icsEnd.getHours(),icsEnd.getMinutes()], title:icsEvent.summary ,location:eventToAdd.location, description:eventToAdd.teacher, alarms:alarm,productId:"AurionFetcherJS", uid:icsEvent.uid};
              eventsToSync.push(tmp);
              let tmp2 = {start:[icsStart.getFullYear(),icsStart.getMonth()+1,icsStart.getDate(),icsStart.getHours(),icsStart.getMinutes()], end:[icsEnd.getFullYear(),icsEnd.getMonth()+1,icsEnd.getDate(),icsEnd.getHours(),icsEnd.getMinutes()], title:icsEvent.summary ,location:strikeThrough(icsEvent.location)+" "+eventToAdd.location, description:strikeThrough(icsEvent.description)+" "+eventToAdd.teacher, alarms:alarm,productId:"AurionFetcherJS", uid:icsEvent.uid};
              trail.editedEvents.push(tmp2);
              eventToAdd.checked = true;
            }
          }
        }
      }
    }

    //Loop on new events, and add them to ics parser
    for (const eventToAdd of trail.formattedEvents){
      let start = new Date(eventToAdd.start);
      let end = new Date(eventToAdd.end);
      if (typeof(eventToAdd.checked) == 'undefined'){
        console.log(eventToAdd);
        let tmp = {start:[start.getFullYear(),start.getMonth()+1,start.getDate(),start.getHours(),start.getMinutes()], end:[end.getFullYear(),end.getMonth()+1,end.getDate(),end.getHours(),end.getMinutes()], title:eventToAdd.course ,location:eventToAdd.location, description:eventToAdd.teacher, productId:"AurionFetcherJS"};
        eventsToSync.push(tmp);
        trail.addedEvents.push(tmp);
        eventToAdd.checked = true;
      }
    }

    //Write events in .ics file
    const { error, value } = ics.createEvents(eventsToSync);

    if (error) {
      console.log(error)
      return
    }
    writeFileSync("data/events.ics", value);

  }

  //If .ics file is empty aka : first run
  else{
    let eventsToSync = new Array();

    let alarm;
    if(config.alarm === true){
      alarm = [{ action: 'display', trigger: {minutes: config.xMinutesBeforeEventAlarm, before: true }}];
    }
    else{
      alarm = [];
    }

    //Loop on fetched events & add them to ics parser
    for (const eventToAdd of trail.formattedEvents){
      let start = new Date(eventToAdd.start);
      let end = new Date(eventToAdd.end);
      let tmp = {start:[start.getFullYear(),start.getMonth()+1,start.getDate(),start.getHours(),start.getMinutes()], end:[end.getFullYear(),end.getMonth()+1,end.getDate(),end.getHours(),end.getMinutes()], title:eventToAdd.course ,location:eventToAdd.location, description:eventToAdd.teacher, alarms:alarm,productId:"AurionFetcherJS"};
      eventsToSync.push(tmp);
    }

    //write events in .ics file
    const { error, value } = ics.createEvents(eventsToSync);

    if (error) {
      console.log(error)
      return
    }
    writeFileSync("data/events.ics", value);
  }


  console.log("Events synced !");
  return true;
};

function strikeThrough(text) {
  return text
    .split('')
    .map(char => char + '\u0336')
    .join('')
}
