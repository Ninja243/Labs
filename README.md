# Labs
## Tl;Dr
A cross platform and GDPR compliant application being written in React Native to replace the service currently running at https://jl.mweya.duckdns.org

Uses Docker/podman, Golang and MongoDB, and comes with setup instructions!
Check the alpha out at https://jl.x-mweya.duckdns.org, and feel free to use this as a boilerplate for your applications.

## App
The app has been written in React Native (Expo) which allows for the compilation of a native Android application, a native iOS application and a JavaScript version that can either run in your web browser or on the Expo application.

## API
The API is written in GoLang and uses JSON Web Tokens (JWTs) to verify that users have been authenticated. Auth0 has been used to simplify the process and make sure that every client uses a similar authentication flow. Thanks to Docker, a scalable and secure way to set this up *without* having to deal with source files and the like has been made available, and images for the API can be pulled from Docker Hub and run using the single docker-compose.yml file in the "server deployment" folder above!
The readme file in that directory contains more potentially helpful information.

## Troubleshooting
Problems? Feel free to contact me at mweyaruider@gmail.com and I'll do my best to help!

## Hiring?
I'm interested! Feel free to contact me at mweyaruider@gmail.com.
