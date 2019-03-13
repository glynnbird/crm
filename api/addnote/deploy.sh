#!/bin/bash

# zip up the addnote module
npm install
zip -r addnote.zip addnote.js package.json node_modules
ibmcloud fn action update crm/addnote addnote.zip --web true --kind nodejs:10
rm -rf node_modules
rm addnote.zip

# configure API call
ibmcloud fn api create /crm /addnote post crm/addnote --response-type http