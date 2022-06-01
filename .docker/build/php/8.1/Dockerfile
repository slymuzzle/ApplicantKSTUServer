FROM alpine:3.15 as main

RUN apk --no-cache --repository https://dl-cdn.alpinelinux.org/alpine/edge/main add \
    icu-libs \
    icu-data-full \
    &&apk --no-cache --repository https://dl-cdn.alpinelinux.org/alpine/edge/community add \
    # Current packages don't exist in other repositories
    libavif \
    && apk add --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing/ --allow-untrusted gnu-libiconv \
    # Packages
    tini \
    php81 \
    php81-dev \
    php81-common \
    php81-gd \
    php81-xmlreader \
    php81-bcmath \
    php81-ctype \
    php81-curl \
    php81-exif \
    php81-iconv \
    php81-intl \
    php81-mbstring \
    php81-opcache \
    php81-openssl \
    php81-pcntl \
    php81-phar \
    php81-session \
    php81-xml \
    php81-xsl \
    php81-zip \
    php81-zlib \
    php81-dom \
    php81-fpm \
    php81-sodium \
    php81-pdo_pgsql \
    php81-pgsql \
    php81-posix \
    php81-redis \
    # Iconv Fix
    php81-pecl-apcu \
    && ln -s /usr/bin/php81 /usr/bin/php \
;

ADD rootfs /

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["/usr/sbin/php-fpm81", "-R", "--nodaemonize"]

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

RUN apk add -U --no-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/testing/   \
        bash \
        php81-pear \
        openssh \
        supervisor \
        autoconf \
        git \
        curl \
        wget \
        make \
        zip \
        php81-xdebug \
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
