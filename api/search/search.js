const Cloudant = require('@cloudant/cloudant')
const HEADERS = { 'Content-Type': 'application/json'}
let cloudant = null
let db = null

// main
async function main(args) {

  // Cloudant connection
  if (!cloudant) {
    const url = args.COUCH_URL
    cloudant = Cloudant({url: url, plugins:['promises']})
    db = cloudant.db.use('crm')
  }

  // Cloudant Query to find matching businesses 
  // using the global/byName index
  const s = {
    selector: {
      '$text': args.query
    },
    limit: 10,
    use_index: ['global', 'byName']
  }
  
  // make the API call
  try {
    const info = await db.find(s)
    return {
      body: info,
      statusCode: 200,
      headers: HEADERS
    }
  } catch (e) {
    return {
      body: { ok: false },
      statusCode: e.statusCode || 500,
      headers: HEADERS
    }
  }

}

exports.main = main
