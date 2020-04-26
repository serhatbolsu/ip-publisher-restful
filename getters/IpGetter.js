const ipaddr = require('ipaddr.js');
const superagent = require('superagent');


var ip_regex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/gm;

module.exports =  class IpGetter {
  constructor(name, url) {
    this.name = name;
    this.url = url;
  }

  async get_ip() {
    let res = await superagent.get(this.url);
    let text = typeof  res === 'object' ? JSON.stringify(res.text) : res.text;
    let ip_text = text.match(ip_regex);
    let valid_ips = ip_text.filter(ip => ipaddr.isValid(ip));

    if (valid_ips.length === 0) {
      throw new Error('Could not get ip from text')
    } else if (valid_ips.length > 1) {
      throw new Error(`Got multiple ips from text ${String(valid_ips)}`);
    }
    return valid_ips[0];
  }
};
