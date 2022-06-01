FROM nginx:1.17-alpine as main

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

FROM main as dev

ARG APP_USER=docker
ARG APP_GROUP=docker
ARG APP_USER_ID=1000
ARG APP_GROUP_ID=1000

# Install packages
RUN apk --update --no-cache add openssl \
    # Add user
    && addgroup -g ${APP_GROUP_ID} ${APP_GROUP} \
    && adduser -u ${APP_USER_ID} -G ${APP_GROUP} -h /home/${APP_USER} -D ${APP_USER} \
;

EXPOSE 80 443