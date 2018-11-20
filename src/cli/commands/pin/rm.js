'use strict'

const multibase = require('multibase')
const { print } = require('../../utils')
const { cidToString } = require('../../../utils/cid')

module.exports = {
  command: 'rm <ipfsPath...>',

  describe: 'Removes the pinned object from local storage.',

  builder: {
    'ipfs-path': {}, // Temporary fix for https://github.com/yargs/yargs-parser/issues/151
    recursive: {
      type: 'boolean',
      alias: 'r',
      default: true,
      describe: 'Recursively unpin the objects linked to by the specified object(s).'
    },
    'cid-base': {
      describe: 'Number base to display CIDs in.',
      type: 'string',
      choices: multibase.names
    }
  },

  handler: ({ ipfs, ipfsPath, recursive, cidBase }) => {
    ipfs.pin.rm(ipfsPath, { recursive, cidBase }, (err, results) => {
      if (err) { throw err }
      results.forEach((res) => {
        print(`unpinned ${cidToString(res.hash, argv.cidBase)}`)
      })
    })
  }
}
