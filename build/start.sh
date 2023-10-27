#!/bin/sh

# Set Public Path to static assets *.html, *.css, *.img, *.js ("publicPath":"/")
cd /usr/share/nginx/html
find . -type f -exec sed -i "s|/base-public-path/|$PUBLIC_PATH|g" {} +
# find -name 'app.*.js' -exec sed -i "s|/base-public-path/|$PUBLIC_PATH|g" {} \;


# folder with dist app files
cd /usr/share/nginx/html/static/js


# Set API Proxy connection
find -name 'app.*.js' -exec sed -i "s|http://localhost:8085/api/adempiere/|$API_URL|g" {} \;

# Set Task Manager connection
find -name 'app.*.js' -exec sed -i "s|http://localhost:8080/v1|$TASK_MANAGER_URL|g" {} \;


# Start nginx web server
nginx && tail -f /dev/null
