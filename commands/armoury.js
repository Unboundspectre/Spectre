'use strict'

const request = require('request')
const envConfig = require('../envConfig.json')

// AVATAR Full URL https://render-eu.worldofwarcraft.com/character/chamber-of-aspects/44/78310956-avatar.jpg

const fields = [
  'progression'
]
const blizzardAPI = 'https://eu.api.battle.net/wow'

module.exports = function (api, args, user, userId, channelId) {
  let serverId = api.bot.channels[channelId].guild_id

  if (!args) {
    api.bot.sendMessage({
      to: channelId,
      message: `Please specify a Character Name`
    })

    return
  }

  args = args.split(' ')

  const requestUrl = `${blizzardAPI}/character/chamber-of-aspects/${encodeURI(args[0])}?fields=${fields.join(',')}&locale=en_GB&apikey=${envConfig.blizzardKey}`

  api.log(requestUrl, 'warning')

  request({
    method: 'GET',
    url: requestUrl,
    json: true
  }, (error, response, body) => {
    if (error) {
      api.log(error, 'error')

      return
    }

    if (body.hasOwnProperty('progression') && body.progression.hasOwnProperty('raids')) {
      const raids = body.progression.raids.filter(raid => raid.name === 'The Nighthold')[0]

      let message = ['```ini']
      message.push('[ The Nighthold ]')
      raids.bosses.forEach(boss => {
        message.push(' ')
        message.push(`  [ ${boss.name} ]`)
        // message.push(`   - ${boss.lfrKills} LFR Kills`)
        message.push(`   - ${boss.normalKills} Normal Kills`)
        message.push(`   - ${boss.heroicKills} Heroic Kills`)
        // message.push(`   - ${boss.mythicKills} Mythic Kills`)
      })
      message.push('```')

      api.bot.sendMessage({
        to: channelId,
        message: message.join('\n')
      })
    } else {
      api.bot.sendMessage({
        to: channelId,
        message: `Character by the name "${args[0]}" not found`
      })
    }
  })
}
