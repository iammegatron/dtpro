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


app.get('/update', (req, res) => {
  resp = {}
  resp.cur_ver = require('./package.json').version;
  git.fetch({"--tags":null}).tags((e,tags)=>{
        resp.latest_ver = tags.latest
        res.status(200).json(resp);
  })
});


app.get('/update/start', (req, res) => {
  git.pull(function(err, update) {
    console.log("pulled from ",err, update)
    if(update && update.summary.changes) {
      //require('child_process').exec('./restart_server.sh');
      //process.exit(1);
    }
  });
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
