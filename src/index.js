const express = require('express')
const toml = require('toml')
const fs = require('fs')

var config = toml.parse(fs.readFileSync('config.toml'))

global.patrons = {}

require('./poll.js')(config)
setInterval(() => {
  require('./poll.js')(config)
}, 15000)

const app = express()
require('./endpoints/ispremium.js')(config,app)
require('./endpoints/ping.js')(app)

var split = config.server.host.split(":")
app.listen(parseInt(split[1]), split[0], () => console.log(`Listening on ${config.server.host}`))
