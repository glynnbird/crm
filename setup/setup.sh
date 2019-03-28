#!/bin/bash

if [ -z "$COUCH_URL" ]
then
  echo "Set $COUCH_URL with your Cloudant URL."
  exit 1
fi

# content-type for HTTP requests
CT="Content-type: application/json"

# create the database - enable partitioning
curl -X PUT "$COUCH_URL/crm?partitioned=true"

# create a partitioned index on "type"
I='{"index":{"fields":["type"]},"type":"json","ddoc":"partitioned","name":"byType","partitioned":true}'
curl -X POST -H "$CT" -d"$I" "$COUCH_URL/crm/_index"

# create a global index on "type" (for docs of type==compamy)
I='{"index":{"fields":[{"name":"name","type":"string"}],"partial_filter_selector":{"type":"company"}},"type":"text","ddoc":"global","name":"byName","partitioned":false}'
curl -X POST -H "$CT" -d"$I" "$COUCH_URL/crm/_index"

# create some data
cat template.json | datamaker -f json -i 1000 | couchimport --db crm --type jsonl
cat template2.json | datamaker -i 1000 | couchimport --db crm --type jsonl
