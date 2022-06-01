FROM alpine:3.14 as main

RUN apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/community/ --allow-untrusted gnu-libiconv \
    && apk add -U --no-cache \
    # Packages
    tini \
    php8 \
    php8-dev \
    php8-common \
    php8-gd \
    php8-xmlreader \
    php8-bcmath \
    php8-ctype \
    php8-curl \
    php8-exif \
    php8-iconv \
    php8-intl \
    php8-mbstring \
    php8-opcache \
    php8-openssl \
    php8-pcntl \
    php8-phar \
    php8-session \
    php8-xml \
    php8-xsl \
    php8-zip \
    php8-zlib \
    php8-dom \
    php8-fpm \
    php8-sodium \
    php8-pdo_pgsql \
    php8-pgsql \
    php8-posix \
    php8-redis \
    php8-tokenizer \
    # Iconv Fix
    && apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/community/ --allow-untrusted php8-pecl-apcu \
    && ln -s /usr/bin/php8 /usr/bin/php

ADD rootfs /

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["/usr/sbin/php-fpm8", "-R", "--nodaemonize"]

EXPOSE 9000

ARG APP_CODE_PATH="/var/www/html"
WORKDIR "${APP_CODE_PATH}"

FROM main as dev

ARG APP_USER=docker
ARG APP_GROUP=docker
ARG APP_USER_PASSWORD=docker
ARG APP_USER_ID=1000
ARG APP_GROUP_ID=1000

ARG COMPOSER_VERSION=2.2.1

RUN apk add -U --no-cache \
        bash \
        nodejs \
        yarn \
        php8-pear \
        openssh \
        supervisor \
        autoconf \
        git \
        curl \
        wget \
        make \
        zip \
        php8-xdebug \
    # Delete APK cache.
    && rm -rf /var/cache/apk/* \
    # Add user
    && addgroup -g ${APP_GROUP_ID} ${APP_GROUP} \
    && adduser -u ${APP_USER_ID} -G ${APP_GROUP} -h /home/${APP_USER} -D ${APP_USER} \
    # Create ssh user for dev.
    && sed -i s/#PermitRootLogin.*/PermitRootLogin\ yes/ /etc/ssh/sshd_config \
    && echo "${APP_USER}:${APP_USER_PASSWORD}" | chpasswd \
    && ssh-keygen -A \
    # Download composer.
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/bin --filename=composer --version=${COMPOSER_VERSION}

ARG GIT_USER_MAIL='user@test.com'
ARG GIT_USER='user'

# GIT config
USER ${APP_USER}
RUN git config --global user.email "${GIT_USER_MAIL}" \
    && git config --global user.name "${GIT_USER}"
USER root

ADD devfs /

CMD ["supervisord", "--nodaemon", "--configuration", "/etc/supervisord/conf.d/supervisord.conf"]

EXPOSE 22 9003
