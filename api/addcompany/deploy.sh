#!/bin/bash

# zip up the addcompany module
npm install
zip -r addcompany.zip addcompany.js package.json node_modules
ibmcloud fn action update crm/addcompany addcompany.zip --web true --kind nodejs:10
rm -rf node_modules
rm addcompany.zip

# configure API call
ibmcloud fn api create /crm /addcompany post crm/addcompany --response-type http