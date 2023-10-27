#!/bin/sh

# folder with dist app files
cd /usr/share/nginx/html/static/js


# Set API Proxy connection
find -name 'app.*.js' -exec sed -i "s|http://localhost:8080/api/|$API_URL|g" {} \;

# Set Task Manager connection
find -name 'app.*.js' -exec sed -i "s|http://localhost:8080/v1|$TASK_MANAGER_URL|g" {} \;


# Start nginx web server
nginx && tail -f /dev/null
