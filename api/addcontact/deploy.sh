#!/bin/bash

# zip up the addcontact module
npm install
zip -r addcontact.zip addcontact.js package.json node_modules
ibmcloud fn action update crm/addcontact addcontact.zip --web true --kind nodejs:10
rm -rf node_modules
rm addcontact.zip

# configure API call
ibmcloud fn api create /crm /addcontact post crm/addcontact --response-type http