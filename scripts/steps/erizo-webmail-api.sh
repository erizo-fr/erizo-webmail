#!/bin/bash

echo ""
echo "--------------------------------------------------"
echo "Setting up Erizo-webmail-api"
echo "--------------------------------------------------"

echo "Cleaning ..."
pkill -f node
rm -rf /vagrant/api/node_modules
rm -rf /vagrant/api/logs
rm -rf /tmp/erizo-webmail-api_node_modules


echo "Initializing folders ..."
mkdir /tmp/erizo-webmail-api_node_modules
chown -R vagrant:vagrant /tmp/erizo-webmail-api_node_modules
ln -s /tmp/erizo-webmail-api_node_modules /vagrant/api/node_modules


echo "Installing NodeJS dependencies ..."
su - vagrant -c 'cd /vagrant/api; npm install'

# Launch the API
echo "Starting Erizo-webmail-api ..."
su - vagrant -c 'mkdir -p /vagrant/api/logs/'
# Set the NODE_PATH var before launching command (otherwise some modules are not found. Any help is welcome :) )
su - vagrant -c 'cd /vagrant/api; export NODE_PATH=${NODE_PATH}:/tmp/erizo-webmail-api_node_modules; nohup npm start > /vagrant/api/logs/stdout.log 2>&1 &'
