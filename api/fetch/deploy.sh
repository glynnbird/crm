#!/bin/bash

# add functions into the package
ibmcloud fn action update crm/fetch fetch.js --web true --kind nodejs:10

# configure api gateway
ibmcloud fn api create /crm /fetch get crm/fetch --response-type http
