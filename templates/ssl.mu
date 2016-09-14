server {
        listen 80;
        return 301 https://$host$request_uri;
}

server {
        listen 443 ssl;
        server_name {{host}};

        ssl_certificate {{fullchain}};
        ssl_certificate_key {{privkey}};

        access_log /var/log/nginx/{{host}}-access.log;
        error_log /var/log/nginx/{{host}}-error.log;

        location /.well-known {
                alias /var/www/{{host}}/.well-known;
        }

        location / {
                proxy_pass {{proxy_pass}};
                proxy_set_header        Host    $host;
                proxy_set_header        X-Forwarded-For $remote_addr;
        }
}
