const express = require('express')
const app = express()
var fs = require('fs');

var mysteps = JSON.parse(fs.readFileSync("./mysteps.json", 'utf8'));

var git = require('simple-git')()

//middleware
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static(__dirname+"/dist"));


app.get('/', function (req, res) {
  res.sendFile(__dirname + "/dist/index.html")
})

app.get('/load', (req,res)=>{
  res.json(mysteps);
})

app.post('/save',(req,res)=>{
  mysteps = req.body;
  console.log("saved object:", req.body);
  fs.writeFileSync('./mysteps.json', JSON.stringify(mysteps));
  res.sendStatus(200);
})


app.get('/acmotor', (req,res)=>{
  console.log("start/stop motor:", req.query.run);
  if(+req.query.run){
    mb.startMotor(()=>{
      mb.getMotorParam([{num:32, type:1, val:null}],(_, params)=>{
        res.json(params);
      })
    })
  }else{
    mb.stopMotor(()=>{
      mb.getMotorParam([{num:32, type:1, val:null}],(_, params)=>{
        res.json(params);
      })
    })
  }
})

app.get('/acspeed', (req,res)=>{
  console.log("set ac motor speed:", req.query.rpm);
  mb.setMotorParam([{num:31, type:1, val:10*req.query.rpm}], ()=>{
    mb.getMotorParam([{num:31, type:1, val:null}],(_, params)=>{
      res.json(params);
    })
  }) //scale from 0--100 to 0--1000

})


app.get('/direction', (req,res)=>{
  console.log("set ac motor direction:", req.query.dir);
  mb.setMotorParam([{num:30, type:1, val:+req.query.dir}],()=>{
    mb.getMotorParam([{num:30, type:1, val:null}],(_, params)=>{
      res.json(params);
    })
  })
})

app.get('/dcmotor', (req,res)=>{
  console.log("set dc motor:", req.query.rpm);
  if(req.query.rpm){
    if(req.query.rpm==0){
      p5.digitalWrite(0)
      p6.digitalWrite(0)
      p13.digitalWrite(0)
    }else{
      p5.pwmWrite(200+10*req.query.rpm) //0 to 255
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

//connect to drv8323 pcb
var sp = require('ti-serialport');
var mb = require('ti-mdbu-serial')
sp.pollStart(1000);
sp.config({options:{baudrate:9600}})
setTimeout(()=>{
  sp.open({id:'/dev/ttyACM0'}, ()=>{
    mb.init(sp)
    setTimeout(()=>{
      mb.ping(()=>{
        mb.setGpio([[0,1]])})
      },5000)
  })
}, 5000)
