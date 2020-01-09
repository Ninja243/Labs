FROM golang:alpine

# install git
RUN apk --update add \
	git openssl gcc musl-dev \
	&& rm /var/cache/apk/*

WORKDIR /go/src

ADD . /go/src

RUN go get
#RUN go-wrapper download

CMD ["go", "run", "main.go"]

EXPOSE 3010
