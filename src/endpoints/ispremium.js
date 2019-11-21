module.exports = (config, app) => {
  app.get('/ispremium', (req, res) => {
    if(req.query.key != config.server.key) {
      res.status(403).json({
        error: "Invalid secret key"
      })
      return
    }

    var id = req.query.id
    if(id in global.patrons) {
      res.json(global.patrons[id])
    } else {
      res.send({
        premium: false
      })
    }
  })
}
