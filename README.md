# Labs
[![forthebadge](https://forthebadge.com/images/featured/featured-gluten-free.svg)](https://forthebadge.com)
[![ForTheBadge uses-js](http://ForTheBadge.com/images/badges/uses-js.svg)](http://ForTheBadge.com)
[![ForTheBadge uses-css](http://ForTheBadge.com/images/badges/uses-css.svg)](http://ForTheBadge.com)
[![ForTheBadge uses-git](http://ForTheBadge.com/images/badges/uses-git.svg)](https://GitHub.com/)
[![ForTheBadge uses-badges](http://ForTheBadge.com/images/badges/uses-badges.svg)](http://ForTheBadge.com)
[![forthebadge cc-by](http://ForTheBadge.com/images/badges/cc-by.svg)](https://creativecommons.org/licenses/by/4.0)
---
## Tl;Dr
A cross platform and GDPR compliant application being written in React Native to replace the service currently running at https://jl.mweya.duckdns.org

Uses Docker/podman, Golang and MongoDB, and comes with setup instructions!
Check the alpha out at https://jl.x-mweya.duckdns.org, and feel free to use this as a boilerplate for your applications. More specific information can be found in the README files in the client, server and server deployment directories.

## App
The app has been written in React Native (Expo) which allows for the compilation of a native Android application, a native iOS application and a JavaScript version that can either run in your web browser, on the Expo application or on your Android or iOS phone. Cool tech like React Redux and React Navigation have been used to build this.

## API
The API is written in GoLang and uses JSON Web Tokens (JWTs) to verify that users have been authenticated. Auth0 has been used to simplify the process and make sure that every client uses a similar authentication flow. Thanks to Docker, a scalable and secure way to set this up *without* having to deal with source files and the like has been made available. Images for the API can be pulled from Docker Hub and run using the single docker-compose.yml file in the "server deployment" folder above.
The readme file in that directory contains more potentially helpful information.

## Troubleshooting
Problems? Feel free to contact me at mweyaruider@gmail.com and I'll do my best to help!

## Hiring?
I'm interested! Feel free to contact me at mweyaruider@gmail.com.
