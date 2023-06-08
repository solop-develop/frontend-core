FROM nginx:1.25.0-alpine3.17

LABEL maintainer="Elsiosanches@gmail.com; EdwinBetanc0urt@outlook.com;" \
	description="ADempiere-Vue."


# Init ENV with default values
ENV API_URL="http://localhost:8085" \
	TZ="America/Caracas"


# Add operative system dependencies
RUN echo "Set Timezone..." && \
	echo $TZ > /etc/timezone && \
	apk add --no-cache tzdata


# Copy src files
COPY build/start.sh .
COPY dist/ /usr/share/nginx/html/


RUN chmod +x *.sh


ENTRYPOINT ["sh" , "start.sh"]
