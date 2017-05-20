'use strict'

const classes = [
  'death knight',
  'demon hunter',
  'druid',
  'hunter',
  'mage',
  'monk',
  'paladin',
  'priest',
  'rogue',
  'shaman',
  'warlock',
  'warrior'
]

module.exports = function (api, args, user, userId, channelId) {
  let serverId = api.bot.channels[channelId].guild_id

  if (!args) {
    api.bot.sendMessage({
      to: channelId,
      message: `Please specify a Class:\nChoose one from the following options: \`${classes.join('`, `')}\``
    })

    return
  }

  args = args.split(' ')

  if (args[0].toLowerCase() === 'remove' && args.length > 1) {
    let vClass = validateClass(args[1].toLowerCase())
    const selectedClass = searchClass(api.bot.servers[serverId].roles, vClass)

    if (selectedClass) {
      api.log(`Removing class: ${vClass} from ${user}`, 'info')
      api.bot.removeFromRole({
        serverID: serverId,
        userID: userId,
        roleID: selectedClass.id
      })
      api.bot.sendMessage({
        to: channelId,
        message: `Removed class ${vClass} from ${user}`
      })
    }
  }

  let vClass = validateClass(args[0].toLowerCase())
  if (vClass) {
    const selectedClass = searchClass(api.bot.servers[serverId].roles, vClass)

    if (selectedClass) {
      api.log(`Adding class: ${vClass} to ${user}`, 'info')
      api.bot.addToRole({
        serverID: serverId,
        userID: userId,
        roleID: selectedClass.id
      })

      api.bot.sendMessage({
        to: channelId,
        message: `Added class ${vClass} to ${user}`
      })

      for (const removableClassId of api.bot.servers[serverId].members[userId].roles) {
        const removableClass = api.bot.servers[serverId].roles[removableClassId]
        if (validateClass(args[0]) !== removableClass.name && classes.includes(removableClass.name.toLowerCase())) {
          api.log(`Removing class: ${removableClass.name} from ${user}`, 'info')
          setTimeout(() => api.bot.removeFromRole({
            serverID: serverId,
            userID: userId,
            roleID: searchClass(api.bot.servers[serverId].roles, removableClass.name).id
          }), 100)
        }
      }
    }
  }
}

function searchClass (serverClasses, inputClass) {
  for (const classId in serverClasses) {
    if (serverClasses.hasOwnProperty(classId) && serverClasses[classId].name === inputClass) {
      return serverClasses[classId]
    }
  }
}

function validateClass (proposedClass) {
  switch (true) {
    case /dk|death/.test(proposedClass):
      proposedClass = 'death knight'
      break
    case /dh|demon/.test(proposedClass):
      proposedClass = 'demon hunter'
      break
  }

  if (classes.includes(proposedClass)) {
    return toTitleCase(proposedClass)
  }
}

function toTitleCase (str) {
  return str.replace(/\w\S*/g, text => `${text.charAt(0).toUpperCase()}${text.substr(1).toLowerCase()}`)
}
