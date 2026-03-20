FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
# nginx base image provides the default CMD
