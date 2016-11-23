# Nodejs Let's Encrypt Nginx reverse proxy generator

This package is a command line that automates the configuration of an SSL certificate for a reverse proxy website hosted via Nginx using Let's Encrypt.

## Installation

    npm install -g letsencrypt-nginx-proxy
   
## Usage
    >letsencrypt-nginx-proxy [options]
Options:
* -h, --help                                    output usage information
* -V, --version                                 output the version number
* -d, --domain [domain]                         Set the domain you want the certificate for
* -np, --nginx-proxy-pass [http uri or socket]  The nginx proxy pass for the domain
* -ncl, --nginx-config-symlink-path [path]      The root path for nginx config simlink file [/etc/nginx/sites-enabled]
* -lc, --le-config-dir [path]                   The root config path for lets encrypt [/etc/letsencrypt]
* -lw, --le-webroot-path [path]                 The root path for lets encrypt static file [/var/www/html]
* -nc, --nginx-config-path [path]               The root path for nginx config file [/etc/nginx/sites-available]

> You must have configured Nginx to listen to your host in a static way to handle the .well-known Let's Encrypt request. The recommended way to do that is to configure your default config file so that /var/www/html is accessible from any listening domain

> You must set up your DNS provider to bind your server's IP to the domain.

## Compatibility

* OS : Linux
* Web server : Nginx