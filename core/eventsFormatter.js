const etree = require('elementtree');

module.exports = async function (trail) {
 let xml = etree.parse(trail.data);
  let events = JSON.parse(xml.findall(".//update")[1].text)["events"];

  let formattedEvents = new Array();

  for (const e of events) {
    let tmp = e["title"];

    let courseTitle;
    let teacherName;
    let location;

    //Introducing new method to parse title

    //- ISEN C405 - Amphi Prépa - VidéoProj\nModule de Base Cryptographie\n13:30 - 17:15\nMonsieur CHENEVERT
    //en TEAMS\n - ISEN A106 - TP Réseaux\nModule de Base Operating Systems\n08:30 - 12:15\nMonsieur DELANNOY
    let infosList = tmp.split("\n");
    for (let e of infosList){
      e = e.trim();
    }
    infosList = infosList.reverse();

    teacherName = infosList[0];
    courseTitle = infosList[2];
    location = infosList[3];

    //Find only room number in location
    const locationRE = /ISEN ([(\wéèà)]*)/g;
    if (location.match(locationRE) != null){
      location = locationRE.exec(location)[0].trim();
    }

    if(location.includes("en teams")){
      location = "💻TEAMS";
    }

    // For teams courses, add "TEAMS"
    for (let e of infosList){
      if(e.includes("en TEAMS") && !location.includes("teams")) {
        location = "💻TEAMS - " + location;
        break;
      }
    }




    /*
    const courseTitle1RE = /Cours de ([(\w éèà)]*)/g;
    const courseTitle2RE = /Cours d'([(\w éèà)]*)/g;
    const courseTitle3RE = /Module ([(\w éèà)]*)/g;
    const teacherName1RE = /Madame ([(\w éèà)]*)/g;
    const teacherName2RE = /Monsieur ([(\w éèà)]*)/g;
    const locationRE = /ISEN ([(\wéèà)]*)/g;
    const letters = /[A-z ]+/;

    if (tmp.match(courseTitle1RE) != null){
      courseTitle = courseTitle1RE.exec(tmp)[1].trim();
    }
    else if(tmp.match(courseTitle2RE) != null) {
      courseTitle = courseTitle2RE.exec(tmp)[1].trim();
    }
    else if(tmp.match(courseTitle2RE) != null) {
      courseTitle = courseTitle2RE.exec(tmp)[1].trim();
    }
    else {
      //old method
      let tmpCt = tmp.split("\n");
      for (let e of tmpCt){
        e = e.trim();
      }
      tmpCt[1] = tmpCt[1].replace("Cours de ", '');
      tmpCt[1] = tmpCt[1].replace("Cours d'", '');
      tmpCt[1] = tmpCt[1].replace(" de ", ' ');
      tmpCt[1] = tmpCt[1].replace(" d' ", ' ');
      tmpCt[1] = tmpCt[1].trim();

      if(tmpCt[1].match(letters)){
        courseTitle = tmpCt[1];
      }
      else{
        courseTitle = "?";
      }
    }

    if (tmp.match(teacherName1RE) != null){
      teacherName = teacherName1RE.exec(tmp)[0].trim();
    }
    else if (tmp.match(teacherName2RE) != null){
      teacherName = teacherName2RE.exec(tmp)[0].trim();
    }
    else {
      teacherName = "Annonyme";
    }

    if (tmp.match(locationRE) != null){
      location = locationRE.exec(tmp)[1].trim();
    }
    else if (tmp.includes("TEAMS")){
      location = "Teams";
    }
    else {
      location = "ISEN Lille";
    }

     */

    if (e["className"] === "est-epreuve"){
      courseTitle = "🎓"+courseTitle;
    }

    if (e["className"] === "TD"){
      courseTitle = "TD "+courseTitle;
    }

    if (e["className"] === "COURS_TD"){
      courseTitle = "CM/TD "+courseTitle;
    }

    if (e["className"] === "TP"){
      courseTitle = "TP "+courseTitle;
    }

    if (e["className"] === "CM"){
      courseTitle = "CM "+courseTitle;
    }

    if (e["className"] === "PROJET"){
      courseTitle = "Proj. "+courseTitle;
    }

    if (e["className"] === "CONF"){
      courseTitle = "Conf. "+courseTitle;
    }

    if (e["className"] === "SEMINAIRE"){
      courseTitle = "Séminaire "+courseTitle;
    }

    if (e["className"] === "REUNION"){
      courseTitle = "Réunion "+courseTitle;
    }

    if (e["className"] === "ENTREPRISE"){
      courseTitle = "Entreprise "+courseTitle;
    }

    if (e["className"] === "EXAM"){
      courseTitle = "Examen(LOL) "+courseTitle;
    }

    tmp = {"start":e["start"], "end":e["end"] ,"course":courseTitle, "location":location, "teacher":teacherName};
    formattedEvents.push(tmp);
  }

  trail.formattedEvents = formattedEvents;

  console.log("          Events formatted !");
  return true;
};

String.prototype.toProperCase = function(opt_lowerCaseTheRest) {
  return (opt_lowerCaseTheRest ? this.toLowerCase() : this)
    .replace(/(^|[\s\xA0])[^\s\xA0]/g, function(s){ return s.toUpperCase(); });
};
