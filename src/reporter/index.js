import pick from 'lodash/pick'
import upperFirst from 'lodash/upperFirst'

import { reporters } from './reports'

const settingsString = process.argv[2]

// TODO: use lib parser that gives context for what JSON fails on error (I think there are plans for liquid-labs/jsonplus or something)
const settings = JSON.parse(settingsString)

const { report, scope, fields, format, ...reportParams } = settings
const [ orgName, repoName ] = scope.split('/')
reportParams.orgName = orgName
if (repoName) reportParams.repoName = repoName

// TODO: temp blocker on using 'fields'
if (fields && fields !== '') {
  console.error("Use of custom '--fields' option not currently implemented.")
  process.exit(1)
}

const reporter = reporters[report]
if (reporter === undefined) {
  console.error(`Could not find report generator for '${report}'`)
  process.exit(1)
}

// await reporter.call(null, settings)
reporter.generator.call(null, reportParams)
  .then((records) => {
    // TODO: support custom fields
    const pickFields = fields || reporter.defaultFields
    
    switch (format) {
      case 'json':
      const fRecords = records.map((r) => pick(r, pickFields))
        console.log(JSON.stringify(fRecords, null, 2)); break
      case 'tsv':
      case 'terminal':
        console.log(pickFields.map((h) => upperFirst(h)).join("\t"))
        const arrayRecords = records.map((r) => {
            const arrayRec = []
            for (const key of pickFields) {
              arrayRec.push(r[key])
            }
            
            return arrayRec
          })
        for (const arrayRec of arrayRecords) {
          console.log(arrayRec.join("\t"))
        }
        break
      default:
        console.error(`Format '${format}' not currently supported.`)
        process.exit(1)
    }
  })
  .catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
