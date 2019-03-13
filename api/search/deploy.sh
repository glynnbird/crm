#!/bin/bash

# add functions into the package
ibmcloud fn action update crm/search search.js --web true --kind nodejs:10

# configure api gateway
ibmcloud fn api create /crm /search get crm/search --response-type http
