const Cloudant = require('@cloudant/cloudant')
const kuuid = require('kuuid')
const HEADERS = { 'Content-Type': 'application/json'}
let cloudant = null

// main
async function main(args) {

  // Cloudant connection
  if (!cloudant) {
    const url = args.COUCH_URL
    cloudant = Cloudant({url: url})
  }
  
  // database object
  const db = cloudant.db.use('crm')
  const partition = kuuid.rand().substr(0,8)
  const obj = {
    _id: partition + ':0', // 0 = the main company record
    type: 'company',
    name: args.name,
    address: args.address,
    description: args.description,
    ts: new Date().toISOString()
  }

  // make the API call
  try {
    const info = await db.insert(obj)
    info.partition = partition
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
