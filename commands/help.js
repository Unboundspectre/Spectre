'use strict'

module.exports = function (api, args, user, userId, channelId) {
  if (!args) {
    api.bot.sendMessage({
      to: channelId,
      message: `Please specify a help command`
    })

    return
  }

  args = args.split(' ')

  if (args[0].toLowerCase() === 'disconnect') {
    api.bot.sendMessage({
      to: channelId,
      message: '```ini\n[ Status ]\nDisconnecting\n```'
    })

    api.bot.disconnect()
  }
}
