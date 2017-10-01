const express = require('express')
const app = express()


var git = require('simple-git')()

//middleware
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static(__dirname+"/dist"));


app.get('/', function (req, res) {
  res.sendFile(__dirname + "/dist/index.html")
})


// app.get('/update', (req, res) => {
//   resp = {}
//   resp.cur_ver = require('./package.json').version;
//   git.fetch({"--tags":null}).tags((e,tags)=>{
//         resp.latest_ver = tags.latest
//         res.status(200).json(resp);
//   })
// });

app.get('/dcmotor', (req,res)=>{
  console.log("set dc motor:", req.query.rpm);
  if(req.query.rpm){
    if(req.query.rpm==0){
      p5.digitalWrite(0)
      p6.digitalWrite(0)
      p13.digitalWrite(0)
    }else{
      p5.pwmWrite(+req.query.rpm) //0 to 255
      p6.digitalWrite(1)
      p13.digitalWrite(0)
    }
  }else{
    p5.digitalWrite(0)
    p6.digitalWrite(0)
    p13.digitalWrite(0)
  }
  res.sendStatus(200);

});

app.get('/update', (req, res) => {
  console.log("updating...")
  git.pull(function(err, update) {
    console.log("pulled from ",err, update)
    if(update && update.summary.changes) {
      require('child_process').exec('./restart_server.sh');
      process.exit(1);
    }else{
      res.json(update);
    }
  });
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


//gpio control
const Gpio = require('pigpio').Gpio;
p5 = new Gpio(5, {mode: Gpio.OUTPUT}); //ENA; PWM
p6 = new Gpio(6, {mode: Gpio.OUTPUT}); //IN1
p13 = new Gpio(13, {mode: Gpio.OUTPUT});//IN2

//init
p5.digitalWrite(0)
p6.digitalWrite(0)
p13.digitalWrite(0)
