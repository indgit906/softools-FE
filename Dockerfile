FROM nginx:alpine

# Remove default html
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app
COPY dist/softools /usr/share/nginx/html

# Copy SSL certs
COPY ssl/fullchain.pem /etc/ssl/certs/fullchain.pem
COPY ssl/private.key /etc/ssl/private/private.key

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
