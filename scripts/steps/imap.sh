#!/bin/bash

echo ""
echo "--------------------------------------------------"
echo "IMAP service ..."
echo "--------------------------------------------------"

command -v node >/dev/null 2>&1 || {
	echo "Installing ..."
	apt-get install -y dovecot-imapd dovecot-lmtpd
} else {
	echo "Dovecot is already installed ... skipping"
}

echo "Configuring ..."
# Use maildir
sed -i 's/^mail_location.*$/mail_location = maildir:~\/Maildir/' /etc/dovecot/conf.d/10-mail.conf

echo "Reload configuration ..."
/etc/init.d/dovecot reload
