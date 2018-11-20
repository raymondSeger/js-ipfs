'use strict'

const multibase = require('multibase')
const { print } = require('../../utils')
const { cidToString } = require('../../../utils/cid')

module.exports = {
  command: 'links <key>',

  describe: 'Outputs the links pointed to by the specified object',

  builder: {
    'cid-base': {
      describe: 'Number base to display CIDs in.',
      type: 'string',
      choices: multibase.names
    }
  },

  handler (argv) {
    argv.ipfs.object.links(argv.key, {
      enc: 'base58'
    }, (err, links) => {
      if (err) {
        throw err
      }

      links.forEach((link) => {
        print(`${cidToString(link.cid, argv.cidBase)} ${link.size} ${link.name}`)
      })
    })
  }
}
