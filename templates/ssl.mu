server {
        listen 80;
        server_name {{domain}};
        return 301 https://$domain$request_uri;
}

server {
        listen 443 ssl;
        server_name {{domain}};

        ssl_certificate {{fullchain}};
        ssl_certificate_key {{privkey}};

        access_log /var/log/nginx/{{domain}}-access.log;
        error_log /var/log/nginx/{{domain}}-error.log;

        location / {
                proxy_pass {{proxy_pass}};
                proxy_set_header        Host    $domain;
                proxy_set_header        X-Forwarded-For $remote_addr;
        }
}
