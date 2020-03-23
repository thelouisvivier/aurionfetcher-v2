const etree = require('elementtree');

module.exports = async function (trail) {
 let xml = etree.parse(trail.data);
  let events = JSON.parse(xml.findall(".//update")[1].text)["events"];

  let formattedEvents = new Array();

  for (const e of events) {
    let tmp = e["title"];

    const courseTitle1RE = /Cours de ([(\w éèà)]*)/g;
    const courseTitle2RE = /Cours d'([(\w éèà)]*)/g;
    const teacherName1RE = /Madame ([(\w éèà)]*)/g;
    const teacherName2RE = /Monsieur ([(\w éèà)]*)/g;
    const locationRE = /ISEN ([(\wéèà)]*)/g;
    const letters = /[A-z ]+/;

    let courseTitle;
    let teacherName;
    let location;

    if (tmp.match(courseTitle1RE) != null){
      courseTitle = courseTitle1RE.exec(tmp)[1].trim();
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
        courseTitle = "Évenement Special";
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
    else {
      location = "ISEN Lille";
    }

    if (e["className"]){
      courseTitle = "🎓"+courseTitle;
    }

    tmp = {"start":e["start"], "end":e["end"] ,"course":courseTitle, "location":location, "teacher":teacherName};
    formattedEvents.push(tmp);
  }

  trail.formatedEvents = formattedEvents;

  console.log("Events formated !");
  return true;
};

String.prototype.toProperCase = function(opt_lowerCaseTheRest) {
  return (opt_lowerCaseTheRest ? this.toLowerCase() : this)
    .replace(/(^|[\s\xA0])[^\s\xA0]/g, function(s){ return s.toUpperCase(); });
};
