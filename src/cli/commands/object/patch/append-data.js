'use strict'

const bl = require('bl')
const fs = require('fs')
const multibase = require('multibase')
const { print } = require('../../../utils')
const dagPB = require('ipld-dag-pb')
const { cidToString } = require('../../../../utils/cid')

function appendData (key, data, ipfs, options) {
  ipfs.object.patch.appendData(key, data, {
    enc: 'base58'
  }, (err, node) => {
    if (err) {
      throw err
    }

    dagPB.util.cid(node, (err, cid) => {
      if (err) {
        throw err
      }

      print(cidToString(cid, options.cidBase))
    })
  })
}

module.exports = {
  command: 'append-data <root> [data]',

  describe: 'Append data to the data segment of a dag node',

  builder: {
    'cid-base': {
      describe: 'Number base to display CIDs in.',
      type: 'string',
      choices: multibase.names
    }
  },

  handler (argv) {
    const ipfs = argv.ipfs
    if (argv.data) {
      return appendData(argv.root, fs.readFileSync(argv.data), ipfs, argv)
    }

    process.stdin.pipe(bl((err, input) => {
      if (err) {
        throw err
      }

      appendData(argv.root, input, ipfs, argv)
    }))
  }
}
