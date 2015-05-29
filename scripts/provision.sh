#!/bin/bash

# Install user conf
/vagrant/scripts/steps/user-conf.sh

# Install build tools
/vagrant/scripts/steps/build-tools.sh

# Installing IMAP server
/vagrant/scripts/steps/imap.sh

# Installing IMAP server
/vagrant/scripts/steps/smtp.sh

# Installing NodeJS
/vagrant/scripts/steps/node.sh

# Install watchman
/vagrant/scripts/steps/watchman.sh

# Erizo webmail - API
/vagrant/scripts/steps/erizo-webmail-api.sh

# Erizo webmail - front app
/vagrant/scripts/steps/erizo-webmail.sh
