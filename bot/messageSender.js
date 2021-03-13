const logger = require('../api/logger')
const selectUserToSendMsg = require('./userTargetSelector')
const { messageWindow, openMessageBtn, sendMessageBtn, messageCloseBtn, messageListInChat } = require('./elements')
const { saveUserInfo, getUserByProfileLink, getUsersByProfileLinks } = require('../api/service/userService')
const { addLog } = require('../api/service/logService')
const {
  cfg: {
    url: { base, contacts },
    waitTImeAfterMessage,
  },
} = require('./utils')
const { increaseCounter, getCounter } = require('../api/service/counterService')

const openProfile = async (page, profileLink) => {
  // ${base} sometimes links can be without orign
  await page.goto(`${profileLink}`, { waitUntil: 'domcontentloaded' })
  logger.info(`Profile openend -> ${profileLink}`)
}

const checkIfUserAnswered = async page => {
  const messageList = await page.$$(`${messageListInChat} li > div > div > a`)

  for (const message of messageList) {
    const userName = await page.evaluate(message => message.querySelector('span').innerText.trim(), message)
    console.log(userName)
    // TODO: check this loop and:
    // 1. get your profile name
    // 2. compare your name to userName in this loop
    // 3. if your name isn't the same with 'userName' in each case return true
  }

  // const userAnswered = await page.evaluate(messageList => {
  //   for (const message of messageList) {
  //     message
  //   }
  // })

  // const messages = await page.evaluate(messageListInChat => {
  //   const messages = document.querySelector(messageListInChat).children
  //   for (const message of messages) {
  //     if (message.querySelector('div > div > a > span')?.innerText.trim() !== 'my name') return true
  //   }
  // })
}

const openMessageWindow = async page => {
  await page.waitFor(5000)
  await page.waitForSelector(openMessageBtn)
  await page.click(openMessageBtn)
  await page.waitForSelector(messageWindow)
  logger.info('Message window opened')
}

const sendMessage = async (page, runConfig, user) => {
  await page.waitFor(2000)
  await page.keyboard.type(runConfig.message)
  if (runConfig.message.length > 3) {
    await page.waitFor(2000)
    await page.click(sendMessageBtn)
    await page.waitFor(3000)
    logger.info(`Message send to: ${user.fullName}`)
    addLog({ type: 'info', message: `Message send to: ${user.fullName}` })
    saveUserInfo({
      ...user,
      followUpMessage: runConfig.followupMessage,
      followupMessageSendTime: new Date(runConfig.followupMessageSendTime),
      followupWasSend: false,
    })
  } else {
    logger.info(`Message to short to send.`)
  }
  await page.click(messageCloseBtn)
}

const filterUsedUsers = async (page, runConfig) => {
  let selectedUsers = await selectUserToSendMsg(page, runConfig) // select users from actual page
  const userProfileLinks = selectedUsers.map(user => user.profileHref)

  let usedUsers = await getUsersByProfileLinks(userProfileLinks) // all used already users

  if (usedUsers && !Array.isArray(usedUsers)) {
    usedUsers = [usedUsers]
  }
  const usedUsersLinks = [...new Set(usedUsers.map(user => user.profileLink))]

  userProfileLinks.filter(userLink => {
    let duplicate = usedUsersLinks.filter(link => link === userLink)
    if (Array.isArray(duplicate)) duplicate = duplicate[0]
    selectedUsers = selectedUsers.filter(selectedUser => selectedUser.profileHref != duplicate)
  })
  logger.info(`Selected user to send message: ${selectedUsers.length}`)

  return selectedUsers
}

const messageLoop = async (page, runConfig, limit = 999) => {
  for (const user of await filterUsedUsers(page, runConfig)) {
    if ((await getCounter()) <= limit) {
      await openProfile(page, user.profileHref)
      await openMessageWindow(page)
      await checkIfUserAnswered(page)
      await sendMessage(page, runConfig.runConfig, user)
      await increaseCounter()
      await page.waitFor(waitTImeAfterMessage)
    } else {
      logger.info('Message limit reached.')
      return
    }
  }
}

module.exports = { messageLoop, openProfile, openMessageWindow, checkIfUserAnswered }
