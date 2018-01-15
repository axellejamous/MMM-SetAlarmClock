var express = require('express')
, logger = require('morgan')
, app = express()
, template = require('jade').compileFile(__dirname + '/source/templates/homepage.jade')
, mqtt = require('mqtt')
, bodyParser = require('body-parser');

// MQTT vars
var mqttServer = 'mqtt://192.168.0.184';
var pub_topic = "alarm/set";

app.use(logger('dev'))
app.use(express.static(__dirname + '/static'))
app.use(bodyParser.urlencoded({ extended:true }))
app.use(bodyParser.json())

client = mqtt.connect(mqttServer);
client.subscribe(pub_topic)

app.get('/', function (req, res, next) {
try {
  var html = template({ title: 'Home' })
  res.send(html)
} catch (e) {
  next(e)
}
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})

app.post('/setalarm', function(req,res){
  console.log(req.body);

  var hour = req.body.hour;
  var min = req.body.min;
  var msg = req.body.msg;

  //var jsonalarm = "{hour: '" + hour + "', min: '" + min + "', msg: '" + msg + "'}";
  //client.publish(pub_topic, jsonalarm); 

  client.publish(pub_topic,JSON.stringify({
    hour: hour,
    min: min,
    msg: msg
    })
  )
})

// MQTT section
client.on('message', function(topic, message) {
  console.log("message from topic: ", topic, " message: ",message);
});