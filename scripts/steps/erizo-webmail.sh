#!/bin/bash

echo ""
echo "--------------------------------------------------"
echo "Setting up Erizo-webmail"
echo "--------------------------------------------------"

echo "Cleaning ..."
pkill -f ember
rm -rf /vagrant/logs
rm -rf /vagrant/node_modules
rm -rf /vagrant/tmp
rm -rf /vagrant/bower_components
rm -rf /tmp/erizo-webmail_node_modules
rm -rf /tmp/erizo-webmail_tmp
rm -rf /tmp/erizo-webmail_bower_components

echo "Initializing folders ..."

mkdir /tmp/erizo-webmail_node_modules
chown -R vagrant:vagrant /tmp/erizo-webmail_node_modules
ln -sf /tmp/erizo-webmail_node_modules /vagrant/node_modules

mkdir /tmp/erizo-webmail_tmp
chown -R vagrant:vagrant /tmp/erizo-webmail_tmp
ln -sf /tmp/erizo-webmail_tmp /vagrant/tmp

mkdir /tmp/erizo-webmail_bower_components
chown -R vagrant:vagrant /tmp/erizo-webmail_bower_components
ln -sf /tmp/erizo-webmail_bower_components /vagrant/bower_components


echo "Installing NodeJS dependencies ..."
su - vagrant -c 'cd /vagrant; npm install'


echo "Installing Bower dependencies ..."
su - vagrant -c 'cd /vagrant; bower install'


# Launch the front app
echo "Starting Erizo-webmail ..."
su - vagrant -c 'mkdir -p /vagrant/logs/'
# Set the NODE_PATH var before launching command (otherwise some modules are not found. Any help is welcome :) )
su - vagrant -c 'cd /vagrant; export NODE_PATH=${NODE_PATH}:/tmp/erizo-webmail_node_modules; nohup ember server --watcher polling --port 8888 --live-reload-port 39609 --proxy http://localhost:8081 > /vagrant/logs/stdout.log 2>&1 &'
