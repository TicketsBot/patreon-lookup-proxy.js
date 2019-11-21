const {patreon} = require('patreon')

module.exports = (config) => {
  var client = patreon(config.oauth.accesstoken)
  var patrons = {}

  const tiers = {
    200: 0
  }

  client(`/campaigns/${config.patreon.campaignid}/pledges`).then((res) => {
    var store = res.store
    var raw = res.rawJson
    var pledges = raw.data.filter((pledge) => { return pledge.attributes['declined_since'] == null })

    var users = raw.included.filter((obj) => { return obj.type == 'user' })
    for(var i in users) {
      var user = users[i]
      var pledge = pledges.filter((pledge) => { return pledge.relationships.patron.data.id == user.id })[0]

      if(pledge) {
        if(user['attributes']['social_connections'] && user['attributes']['social_connections']['discord']) {
          var response = {
            premium: true,
            tier: tiers[pledge.attributes['amount_cents']]
          }

          patrons[user['attributes']['social_connections']['discord']['user_id']] = response
        }
      }
    }
  }).then(() => {
    global.patrons = patrons
  }).catch((e) => {
    console.log(e)
  })
}
