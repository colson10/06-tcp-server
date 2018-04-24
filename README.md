# Lab 06 - TCP-Server
**Author**: Carl Olson
**Version**: 1.0.0

## Overview
This lab project involved setting up a TCP chatroom. Users can communicate with other users on different ports. The client constructor takes a single parameter (the socket) and is exported from the client.js. The server.js exports an object with methods on it to start and stop the server (the server is started from the main.js). The logger.js file exports the winston logger module. 

The server.js also includes the parser.command function that takes two parameters: a message and a client(socket). 

## Getting Started
Git clone this repository. Run node index.js. Use separate terminal tabs to connect to the server using the command 'nc localhost 3000'. 

## Architecture
JavaScript, Babel, ESLint, Jest, Travis CI, Logger, Faker, UUID, Winston, dotenv.

## Change Log
04-23-2018 1:30pm - Scaffolded, wrote main outline of code, and ran initial travis test.
04-23-2018 8:00pm - Created constructor module and added additional commands.

## Credits and Collaborations
Our TA Joy helped me out. 