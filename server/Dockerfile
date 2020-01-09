FROM golang:alpine

# install git and more
RUN apk --update add \
	git openssl gcc musl-dev \
	&& rm /var/cache/apk/*

WORKDIR /go/src

ADD . /go/src

RUN go get
#RUN go-wrapper download

CMD ["go", "run", "main.go"]

# Play nice with Nginx
EXPOSE 3010 1100
