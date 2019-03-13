const Cloudant = require('@cloudant/cloudant')
const HEADERS = { 'Content-Type': 'application/json'}
let cloudant = null

// main
async function main(args) {

  // Cloudant connection
  if (!cloudant) {
    const url = args.COUCH_URL
    cloudant = Cloudant({url: url})
  }
  
  // custom request to fetch all the documents from
  // a known partition partition (or the first 10)
  const r = { 
    method: 'get',
    path: encodeURIComponent('crm') + '/_partition/' + encodeURIComponent(args.partition) + '/_all_docs',
    qs: {
      limit: 10,
      include_docs: true
    }
  }

  // make the API call
  try {
    const info = await cloudant.request(r)
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
