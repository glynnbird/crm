#!/bin/bash

# zip up the addlink module
npm install
zip -r addlink.zip addlink.js package.json node_modules
ibmcloud fn action update crm/addlink addlink.zip --web true --kind nodejs:10
rm -rf node_modules
rm addlink.zip

# configure API call
ibmcloud fn api create /crm /addlink post crm/addlink --response-type http