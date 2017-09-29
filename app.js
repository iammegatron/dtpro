const express = require('express')
const app = express()
//middleware
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static(__dirname+"/dist"));


app.get('/', function (req, res) {
  res.sendFile(__dirname + "/dist/index.html")
})






app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
