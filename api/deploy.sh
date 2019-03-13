#!/bin/bash

# create package "crm"
ibmcloud fn package update crm --param COUCH_URL "$COUCH_URL"

# install addnote
cd addnote; ./deploy.sh; cd ..

# install addcontact
cd addcontact; ./deploy.sh; cd ..

# install fetch
cd fetch; ./deploy.sh; cd ..

# install search
cd search; ./deploy.sh; cd ..
