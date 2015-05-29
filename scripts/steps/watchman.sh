#!/bin/bash

command -v watchman >/dev/null 2>&1 || {
	echo ""
	echo "--------------------------------------------------"
	echo "Installing Watchman ..."
	echo "--------------------------------------------------"
	git clone https://github.com/facebook/watchman.git /opt/watchman
	cd /opt/watchman
	./autogen.sh
	./configure
	make
	make install
}
