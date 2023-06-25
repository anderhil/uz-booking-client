const readline = require('readline')
const moment = require('moment')
const { ApiV3: UzClientV3 } = require('../../dist')

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise(resolve => rl.question(query, ans => {
    rl.close()
    resolve(ans)
  }))
}

async function main() {
  const { UZ_ACCESS_TOKEN } = process.env

  const uzClient = new UzClientV3('uk', UZ_ACCESS_TOKEN)

  if (!UZ_ACCESS_TOKEN) {
    const phoneNumber = await askQuestion('Your phone number: ')

    await uzClient.Auth.sendSms(phoneNumber)

    const code = await askQuestion('Code from SMS: ')

    await uzClient.Auth.login(code)
  }

  const ticketsDate = moment().add(10, 'days')

  const departureStations = await uzClient.Station.find('Київ')
  const departureStationId = departureStations[0].id

  const targetStations = await uzClient.Station.find('Львів')
  const targetStationId = targetStations[0].id

  const trains = await uzClient.Train.find(
    departureStationId,
    targetStationId,
    ticketsDate.format('YYYY-MM-DD'),
  )

  console.dir(trains, { depth: 20, colors: true })
}

main()
