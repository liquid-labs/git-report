import { reporters } from './reports'

const settingsString = process.argv[2]

// TODO: use lib parser that gives context for what JSON fails on error (I think there are plans for liquid-labs/jsonplus or something)
const settings = JSON.parse(settingsString)

console.log(settings) // DEBUG

const { report } = settings

const reportGenerator = reporters[report]
if (reportGenerator === undefined) {
  throw new Error(`Could not find report generator for '${report}'`)
}

// await reportGenerator.call(null, settings)
reportGenerator.call(null, settings)
