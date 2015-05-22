#!/bin/bash

echo ""
echo "--------------------------------------------------"
echo "Installing NodeJS ..."
echo "--------------------------------------------------"
curl -sL https://deb.nodesource.com/setup_dev | sudo bash -
apt-get install -y nodejs

echo ""
echo "--------------------------------------------------"
echo "Installing global node libraries ..."
echo "--------------------------------------------------"
npm install -g ember-cli@0.2.0
npm install -g bower
npm install -g coffee-script@1.9.2
