# Deployment the normal way
To deploy the server, simply run `docker-compose up -d` in this directory. The server and API should be reachable on `localhost:3010`.
I recommend using Nginx as a web proxy and certbot to secure the site.

# Deployment with podman
To deploy the server with podman, make sure you have podman *and* podman-compose installed. To start it simply run `podman-compose up -d`.

# Outageless updates with docker-compose
To update the server without causing outages, first build the containers on you local machine by running `docker-compose build && docker-compose push` in the server directory. Then, from you server, run `docker-compose pull && docker-compose up -d --no-deps --build webservice` to update the container.

# Outageless updates with podman-compose
To do the same using podman-compose, build and push the containers using `podman-compose build && podman-compose push` and then pull and start them on the server using the following command `podman stop $(podman ps -a -q) || podman system prune && podman-compose pull && podman-compose up --no-deps -d`.

# Troubleshooting
 - To view the logs (std.out really) from the containers, first find the container ID using `docker ps`, then run `docker container logs {container id}`, where "{container id}", refers to the ID of the container.
 - Make sure you've logged into Docker Hub to be able to push containers to it
   - For docker, use `docker login`
   - For podman, use `podman login`
