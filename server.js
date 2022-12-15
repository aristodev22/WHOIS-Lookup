// ERROR HANDLING
process.on('uncaughtException', (error, origin) => {
  console.log('----- Uncaught exception -----')
  console.log(error)
  console.log('----- Exception origin -----')
  console.log(origin)
})

process.on('unhandledRejection', (reason, promise) => {
  console.log('----- Unhandled Rejection at -----')
  console.log(promise)
  console.log('----- Reason -----')
  console.log(reason)
})

setTimeout(() => {
  console.log('Server still up and running.');
}, 500);

const express = require('express')
const app = express()
const path = require('path')
var morgan = require('morgan')
const WhoisLight = require("whois-light");
var isValidDomain = require('is-valid-domain')
const ipaddr = require('ipaddr.js');
var geoip = require('geoip-lite');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv')
const { hostname } = require('os')
dotenv.config()

const port = process.env.PORT || 2500

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(morgan('short'))
// app.use(express.static(path.join(__dirname, "public")))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", (req, res) => {
  res.status(301).redirect("https://powerdesign.com.ng/whois-lookup") 
});

app.post("/getwhois", (req, res) => {
  let requestObj;
  let domName = req.body.domaininput;
  // let reqIp = "185.35.50.4"
  var reqIp =  req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  var reqIp4;
  // Parse reqIP into IPV4 type
  if (ipaddr.isValid(reqIp)) {
    reqIp4 = ipaddr.process(reqIp).toString();
  }
console.log(reqIp);
console.log(reqIp4);
  var geo = geoip.lookup(reqIp4);
  var geoCity = geo.city;
  var geoCountry = geo.country;

  // Create an object from the request
  requestObj = {
    domain: domName, 
    IP: reqIp4,
    city: geoCity,
    country: geoCountry,
    time: Date()
      }

  if(isValidDomain(domName)){
    console.log("New POST Request")
    console.log(requestObj);
   
    // Do the lookup and return the response
    WhoisLight.lookup(domName)
          .then(function (whois) {
            // process raw whois information here
            console.log(whois);
            res.send(whois);
                })
                .catch(function(error) {
                     res.send("There was a connection error. Please check your internet settings.")
                   })     

    // Upload to Database
    MongoClient.connect(process.env.CONNECTIONSTRING, function(err, client) {
            client.db().collection("domainEntries").insertOne(requestObj)
            console.log("Saved to dababase");
                      }) 
  } else {
          console.log("Invalid domain entered")
          res.send("Invalid domain format. Kindly enter the domain name in a valid format like <strong>example.com</strong>");
          }
})

app.listen(port, ()=>{
  console.log(`Server is running on port ${port}`)
})