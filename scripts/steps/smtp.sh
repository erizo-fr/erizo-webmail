#!/bin/bash

echo ""
echo "--------------------------------------------------"
echo "SMTP service ..."
echo "--------------------------------------------------"

echo "Configuring ..."
# Use LMTP transport
sed -i 's/^\s*transport\s=.*$/  transport = dovecot_lmtp/' /etc/exim4/conf.d/router/900_exim4-config_local_user

echo "Reload configuration ..."
/etc/exim4/conf.d/router# /etc/init.d/exim4 reload
