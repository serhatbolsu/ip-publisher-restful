const ipGetter = require('./getters/IpGetter');
const ipProviders = require('./getters/providers.json').ipProviders;


const ipGetters = ipProviders.map(row => new ipGetter(row.name, row.url)) ;
console.log(ipGetters);


(async () => {

  let result = await ipGetters[0].get_ip();
  console.log(result)
})();


//
// async function getIPText() {
//   let res = await superagent.get('https://jsonip.com');
//   return typeof res === 'object' ? JSON.stringify(res.text) : res.text;
//   // request("https://jsonip.com", { json: false }, (err, res, body) => {
//   //   if (err) { return console.log(err); }
//   //   return body;
//   // });
// }
//
//
// (async () => {
//
//   let res = await getIPText();
//
//   let result = res.match(ip_regex);
//
//   let array = result.filter(ip => ipaddr.isValid(ip));
//   //
//   console.log(array);
//
//   console.log(`The ip is : ${array}`)
// })();
//
//
