const settingsString = process.argv[2]

// TODO: use lib parser that gives context for what JSON fails on error (I think there are plans for liquid-labs/jsonplus or something)
const settings = JSON.parse(settingsString)

console.log(settings)
