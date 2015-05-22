#!/bin/bash

echo ""
echo "--------------------------------------------------"
echo "Setting up Erizo-webmail"
echo "--------------------------------------------------"

echo "Cleaning ..."
rm -rf /vagrant/node_modules
rm -rf /vagrant/logs
rm -rf /tmp/erizo-webmail_node_modules
rm -rf /tmp/erizo-webmail_bower_components

echo "Initializing folders ..."
mkdir /tmp/erizo-webmail_node_modules
ln -s /tmp/erizo-webmail_node_modules /vagrant/node_modules
mkdir /tmp/erizo-webmail_bower_components
ln -s /tmp/erizo-webmail_bower_components /vagrant/bower_components

echo "Installing NodeJS dependencies ..."
chown -R vagrant:vagrant /tmp/erizo-webmail_node_modules
su - vagrant -c 'cd /vagrant; npm install'

echo "Installing Bower dependencies ..."
chown -R vagrant:vagrant /tmp/erizo-webmail_bower_components
su - vagrant -c 'cd /vagrant; bower install'

# Launch the front app
echo "Starting Erizo-webmail ..."
su - vagrant -c 'mkdir -p /vagrant/logs/'
# Set the NODE_PATH var before launching command (otherwise some modules are not found. Any help is welcome :) )
su - vagrant -c 'cd /vagrant; export NODE_PATH=${NODE_PATH}:/tmp/erizo-webmail_node_modules; nohup ember serve --proxy http://localhost:8081/ &'
