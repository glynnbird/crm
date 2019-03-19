#!/bin/bash

# add functions into the package
ibmcloud fn action update crm/fetchfilter fetchfilter.js --web true --kind nodejs:10

# configure api gateway
ibmcloud fn api create /crm /fetchfilter get crm/fetchfilter --response-type http
