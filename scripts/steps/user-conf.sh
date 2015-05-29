#!/bin/bash

# Configure ember cli
cat > /home/vagrant/.ember-cli <<- EOM
{
  "checkForUpdates" : false
}
EOM

# Configure .bashrc
cat >> /home/vagrant/.bashrc <<- EOM
{
alias ls='ls --color=always'
alias dir='dir --color=always'
alias ll='ls -alh'
}
EOM
cat >> /root/.bashrc <<- EOM
{
alias ls='ls --color=always'
alias dir='dir --color=always'
alias ll='ls -alh'
}
EOM

# Create user test/test
useradd --create-home --password H5LZGFet7hSPw test
