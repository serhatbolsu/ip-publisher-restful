const express = require('express');
const router = express.Router();
const superagent = require('superagent');
const Domain = require('../models/Domain');
const Registrar = require('../models/Registrar');

const { authenticateJWT } = require('./login');
const IpGetter = require("../getters/IpGetter");
const ipProviders = require('../getters/providers.json').ipProviders;

const ipGetters = ipProviders.map(row => new IpGetter(row.name, row.url));

// router.use((req, res, next) => {
//   req.ipGetters = ipProviders.map(row => new IpGetter(row.name, row.url)) ;
//   next();
// });

router.get('/', authenticateJWT, async (req, res) => {
  try {
    const domain = await Domain.findOne({}, 'ip -_id', { sort: { '_id': -1}});
    res.json(domain);
  } catch (err) {
    res.status(500).json({ message: 'Could not find any recent domain'});
  }
});

async function ipGetterRandomized () {
  let getters = ([...ipGetters]).sort(() => Math.random() - 0.5);
  for (let i = 0; i < getters.length + 1; i++) {
    const ip = await getters[i].get_ip();
    if (ip) return {ip: ip};
  }
  throw new Error();
}

async function getOrReturn () {
  const ipObj = await ipGetterRandomized(ipGetters);
  let domainObj = {ip: ''};
  try {
    domainObj = await Domain.findOne({}, 'ip -_id', { sort: { '_id': -1}});
    domainObj = domainObj.toJSON();
  } catch (err) {
    domainObj = {ip: ''};
  }
  if (domainObj.ip === ipObj.ip) {
    return [domainObj, false];
  } else {
    const domain = new Domain(ipObj);
    await domain.save();
    return [{ip: domain.ip}, true];
  }
}

router.post('/', authenticateJWT, async (req,res) => {
  const domainObj =  getOrReturn(ipGetters)[0];
  return res.json(domainObj)
});

async function publish (ip) {
  const registrars = await Registrar.find();
  registrars.forEach((item)=>{
    superagent.post(item.callbackUrl)
        .set('Content-Type', 'application/json')
        .send(`{"ip":"${ip}"}`)
        .timeout({ response: 3000 })
        .retry(2)
        .catch(err => console.error(err.message));
    console.log(item.name);
  })
}

router.post('/publish', authenticateJWT, async (req,res) => {
  const { ip } = req.body;
  publish(ip);
  return res.json();
});

setInterval(async () => {
  const [ domainObj, changed ] =  await getOrReturn();
  if (changed) {
    publish(domainObj.ip)
  }
}, 10000);

module.exports = router;
