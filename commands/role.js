'use strict'

const roles = [
  'healer',
  'melee dps',
  'ranged dps',
  'tank'
]

module.exports = function (api, args, user, userId, channelId) {
  let serverId = api.bot.channels[channelId].guild_id

  if (!args) {
    api.bot.sendMessage({
      to: channelId,
      message: `Please specify a Role:\nChoose one from the following options: \`${roles.join('`, `')}\``
    })

    return
  }

  args = args.split(' ')

  if (args[0].toLowerCase() === 'remove' && args.length > 1) {
    let vRole = validateRole(args[1].toLowerCase(), api, channelId)
    const selectedRole = searchRole(api.bot.servers[serverId].roles, vRole)

    if (selectedRole) {
      api.log(`Removing role: ${vRole} from ${user}`, 'info')
      api.bot.removeFromRole({
        serverID: serverId,
        userID: userId,
        roleID: selectedRole.id
      })
      api.bot.sendMessage({
        to: channelId,
        message: `Removed role ${vRole} from <@!${userId}>`
      })
    }
  }

  let vRole = validateRole(args[0].toLowerCase(), api, channelId)
  if (vRole) {
    const selectedRole = searchRole(api.bot.servers[serverId].roles, vRole)

    if (selectedRole) {
      api.log(`Adding role: ${vRole} to ${user}`, 'info')
      api.bot.addToRole({
        serverID: serverId,
        userID: userId,
        roleID: selectedRole.id
      })

      api.bot.sendMessage({
        to: channelId,
        message: `Added role ${vRole} to <@!${userId}>`
      })

      for (const removableRoleId of api.bot.servers[serverId].members[userId].roles) {
        const removableRole = api.bot.servers[serverId].roles[removableRoleId]
        if (validateRole(args[0].toLowerCase(), api, channelId) !== removableRole.name && roles.includes(removableRole.name.toLowerCase())) {
          api.log(`Removing role: ${removableRole.name} from ${user}`, 'info')
          setTimeout(() => api.bot.removeFromRole({
            serverID: serverId,
            userID: userId,
            roleID: searchRole(api.bot.servers[serverId].roles, removableRole.name).id
          }), 100)
        }
      }
    }
  }
}

function searchRole (serverRoles, inputClass) {
  for (const classId in serverRoles) {
    if (serverRoles.hasOwnProperty(classId) && serverRoles[classId].name === inputClass) {
      return serverRoles[classId]
    }
  }
}

function validateRole (proposedRole, api, channelId) {
  switch (true) {
    case /melee/.test(proposedRole):
      proposedRole = 'melee dps'
      break
    case /ranged/.test(proposedRole):
      proposedRole = 'ranged dps'
      break
  }

  if (roles.includes(proposedRole)) {
    return toTitleCase(proposedRole)
  } else {
    api.bot.sendMessage({
      to: channelId,
      message: `Please specify a Role:\nChoose one from the following options: \`${roles.join('`, `')}\``
    })
  }
}

function toTitleCase (str) {
  return str.replace(/\w\S*/g, text => `${text.charAt(0).toUpperCase()}${text.substr(1).toLowerCase()}`).replace('Dps', 'DPS')
}
