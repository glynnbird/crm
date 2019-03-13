const Cloudant = require('@cloudant/cloudant')
const kuuid = require('kuuid')
const HEADERS = { 'Content-Type': 'application/json'}
let cloudant = null

// main
async function main(args) {

  if (!args.partition) {
    throw new Error('missing argument: partition')
  }

  // Cloudant connection
  if (!cloudant) {
    const url = args.COUCH_URL
    cloudant = Cloudant({url: url})
  }
  
  // database object
  const db = cloudant.db.use('crm')
  const obj = {
    _id: args.partition + ':' + kuuid.idr(),
    type: 'contact',
    name: args.name,
    email: args.email,
    ts: new Date().toISOString()
  }

  // make the API call
  try {
    const info = await db.insert(obj)
    return {
      body: info,
      statusCode: 200,
      headers: HEADERS
    }
  } catch(e) {
    return {
      body: { ok: false },
      statusCode: e.statusCode || 500,
      headers: HEADERS
    }
  }
}

exports.main = main
