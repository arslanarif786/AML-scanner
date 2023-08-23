FROM ubuntu:20.04
ENV DEBIAN_FRONTEND noninteractive
#installation
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    nano \
    nginx
#node & npm installation
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - && \ 
    apt-get update && \
    apt-get install nodejs -y
#workdir
WORKDIR /var/www/html/ASL_merchant/frontend
#copy dir
COPY . /var/www/html/ASL_merchant/frontend
#configuration dev_admin frontend 
COPY Docker/default.conf /etc/nginx/sites-available/default.conf
RUN ln -s /etc/nginx/sites-available/default.conf /etc/nginx/sites-enabled/ && \
    rm /etc/nginx/sites-enabled/default
#build
CMD /bin/bash Docker/run.sh && nginx -g "daemon off;"
#Expose Port
EXPOSE 80




