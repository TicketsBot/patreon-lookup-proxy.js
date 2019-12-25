module.exports = (config, app) => {
  app.get('/ispremium', (req, res) => {
    res.send({
      success: true
    })
  })
}
