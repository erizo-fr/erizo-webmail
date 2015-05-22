#!/bin/bash

# Install build tools
$(dirname $0)/steps/build-tools.sh

# Installing NodeJS
$(dirname $0)/steps/node.sh

# Install watchman
$(dirname $0)/steps/watchman.sh

# Erizo webmail - API
$(dirname $0)/steps/erizo-webmail-api.sh

# Erizo webmail - front app
$(dirname $0)/steps/erizo-webmail.sh
