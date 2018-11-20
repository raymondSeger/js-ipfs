'use strict'

const multibase = require('multibase')
const { print } = require('../../utils')
const dagPB = require('ipld-dag-pb')
const { cidToString } = require('../../../utils/cid')

module.exports = {
  command: 'get <key>',

  describe: 'Get and serialize the DAG node named by <key>',

  builder: {
    'data-encoding': {
      type: 'string',
      default: 'base64'
    },
    'cid-base': {
      describe: 'Number base to display CIDs in.',
      type: 'string',
      choices: multibase.names
    }
  },

  handler ({ ipfs, key, dataEncoding, cidBase }) {
    ipfs.object.get(key, { enc: 'base58' }, (err, node) => {
      if (err) {
        throw err
      }

      dagPB.util.cid(node, (err, result) => {
        if (err) {
          throw err
        }

        let data = node.data

        if (Buffer.isBuffer(data)) {
          data = node.data.toString(dataEncoding || undefined)
        }

        const answer = {
          Data: data,
          Hash: cidToString(result, cidBase),
          Size: node.size,
          Links: node.links.map((l) => {
            return {
              Name: l.name,
              Size: l.size,
              Hash: cidToString(l.cid, cidBase)
            }
          })
        }

        print(JSON.stringify(answer))
      })
    })
  }
}
