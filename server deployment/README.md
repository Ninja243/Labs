# Deployment
To deploy the server, simply run `docker-compose up -d` in this directory. The server and API should be reachable on `localhost:3010`.
I recommend using Nginx as a web proxy and certbot to secure the site.

# Outageless updates
To update the server without causing outages, first build the containers on you local machine by running `docker-compose build && docker-compose push` in the server directory. Then, from you server, run `docker-compose pull && docker-compose up -d --no-deps --build webservice` to update the container.

# Troubleshooting
To view the logs (std.err really) from the containers, first find the container ID using `docker ps`, then run `docker container logs {container id}`, where "{container id}", refers to the ID of the container.
