'use strict'

const Discord = require('discord.io')
const envConfig = require('../envConfig.json')
const moment = require('moment-timezone')

const timeout = 60 * 1000 * 10

module.exports = {
  loadPriority: 1000,
  startPriority: 1000,
  stopPriority: 1000,
  initialize: (api, next) => {
    api.discord = {}
    api.bot = new Discord.Client({
      token: envConfig.token || '',
      autorun: true
    })

    return next()
  },
  start: (api, next) => {
    let timer = setTimeout(() => { api.bot.connect() }, timeout)
    let prefix = '!'

    api.bot.on('ready', () => {
      api.bot.setPresence({
        game: {
          name: 'World Domination',
          type: 1,
          url: 'https://www.twitch.tv/xonefobic'
        }
      })
      api.log(`Time: ${moment().tz('Europe/Amsterdam').format('YYYY-MM-DD HH:mm:ss')}`, 'info')
      api.log(`${api.bot.username} - (${api.bot.id})`, 'info')
    })

    api.bot.on('message', (user, userId, channelId, message, event) => {
      if (channelId in api.bot.directMessages) { return } // Ignore Direct Messages
      if (userId === api.bot.id) { return } // Don't reply to self
      if (message[0] !== prefix) { return } // Message not for the bot

      const serverId = api.bot.channels[channelId].guild_id

      let cmd = message.split(' ')

      clearTimeout(timer)

      timer = setTimeout(() => {
        api.bot.connect()
        api.log('Timed out. Reconnecting')
      }, timeout)

      // ~ //

      cmd = cmd[0].substring(1) // Remove prefix from first word

      if (cmd === 'ping') {
        api.bot.sendMessage({
          to: channelId,
          message: 'pong <:troll:311146565203001344>'
        })
      }
    })

    return next()
  },
  stop: (api, next) => {
    api.bot.disconnect()

    return next()
  }
}
