ARG NGINX_RELEASE $NGINX_RELEASE
FROM nginx:$NGINX_RELEASE

LABEL maintainer="Elsiosanches@gmail.com; EdwinBetanc0urt@outlook.com;" \
	description="ADempiere-Vue."


# Init ENV with default values
ENV API_URL="http://localhost:8085" \
	TZ="America/Caracas"


COPY build/start.sh .
COPY dist/ /usr/share/nginx/html/


RUN echo "Set Timezone..." && \
	echo $TZ > /etc/timezone && \
	apk add --no-cache tzdata && \
	chmod +x *.sh


ENTRYPOINT ["sh" , "start.sh"]
