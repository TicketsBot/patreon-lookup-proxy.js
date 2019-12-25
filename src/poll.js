const {patreon} = require('patreon')

module.exports = (config) => {
  var client = patreon(config.oauth.accesstoken)

  // Should probably improve this but it's Christmas and i cba
  global.patrons = {}

  const tiers = {
    200: 0
  }

  function query(url) {
    client(url).then((res) => {
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

            global.patrons[user['attributes']['social_connections']['discord']['user_id']] = response
          }
        }
      }

      if("next" in raw.links) {
        var next = raw.links.next.replace("https://www.patreon.com/api/oauth2/api", "")
        query(next)
      }
    }).catch((e) => {
      console.log(e)
    })
  }

  query(`/campaigns/${config.patreon.campaignid}/pledges`);
}
