const axios = require("axios");
const querystring = require('querystring');
const config = require('../config/config.json')

module.exports = async function (trail) {
  const headers = {
    "Host": config.domain,
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0",
    "Accept": "application/xml, text/xml, */*; q=0.01",
    "Accept-Language": "fr-FR,fr;q=0.5",
    "Referer": "https://"+config.domain+"/faces/Planning.xhtml",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Faces-Request": "partial/ajax",
    "X-Requested-With": "XMLHttpRequest",
    "Connection": "keep-alive",
    "accept-encoding": "gzip, deflate",
    "Cookie":"JSESSIONID="+trail.sessionId
  };

  const data = {
    "javax.faces.partial.ajax": "true",
    "javax.faces.source": "form:j_idt117",
    "javax.faces.partial.execute": trail.formId,
    "javax.faces.partial.render": trail.formId,
    [trail.formId] : trail.formId,
    [[trail.formId]+"_start"]: config.startDate*1000,
    [[trail.formId]+"_end"]: config.endDate*1000,
    "form": "form",
    "form:largeurDivCenter": "1606",
    "form:j_idt133_view": "week",
    "form:offsetFuseauNavigateur": "-7200000",
    "form:onglets_activeIndex": "0",
    "form:onglets_scrollState": "0",
    "javax.faces.ViewState": trail.viewState
  };

  let res = await axios.post("https://"+config.domain+"/faces/Planning.xhtml",querystring.stringify(data),{headers: headers});

  //console.log(`Status code: ${res.status}`);
  //console.log(`Status text: ${res.statusText}`);
  //console.log(`Request method: ${res.request.method}`);
  //console.log(`Path: ${res.request.path}`);

  //console.log(`Date: ${res.headers.date}`);
  //console.log(`Data: ${res.data}`);
  console.log("          Events fetched !");
  //console.log(res.data);
  trail.data = res.data;
  return true;
};
