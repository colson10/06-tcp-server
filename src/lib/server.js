'use strict';

const net = require('net');
const logger = require('./logger');
const Client = require('./client');


const app = net.createServer();
let clients = [];

const parseCommand = (message, client) => {
  if (!message.startsWith('@')) {
    return false;
  }

  const parsedMessage = message.split(' ');
  const command = parsedMessage[0];
  logger.log(logger.INFO, `Parsing a command ${command}`);

  switch (command) {
    case '@list': {
      const clientNames = clients.map(user => user.nickname).join('\n');
      client.socket.write(`${clientNames}\n`);
      break;
    }
    case '@quit': {
      client.socket.write('Bye, thanks for chatting!');
      client.socket.end();
      break;
    }
    case '@nickname': {
      const tempName = client.nickname;
      client.nickname = parsedMessage[1];
      // client.socket.write(`Your nickname has been changed to: ${client.nickname}\n`);
      clients.forEach(user => user.socket.write(`${tempName} has changed their nickname to ${client.nickname}.\n`));
      break;
    }
    case '@dm': {
      const dmReceiver = parsedMessage[1];
      const dmMessage = parsedMessage.slice(2).join(' ');
      
      clients.forEach((user) => {
        if (user.nickname === dmReceiver) {
          user.socket.write(`${client.nickname} has sent you a DM: ${dmMessage}\n`);
        }
      });
      break;
    }
    
    default:
      client.socket.write('INVALID COMMAND');
      break;
  }
  return client;
};

const removeClient = socket => () => {
  clients = clients.filter(client => client !== socket);
  logger.log(logger.INFO, `Removing ${socket.name}`);
};

// socket is a specific connection, an object
app.on('connection', (socket) => {
  logger.log(logger.INFO, 'new socket');
  
  // make new instance of constructor here. separate module for the constructor.
  const client = new Client(socket);

  clients.push(client);
  socket.write('Welcome to the chat!\n');
  // socket.name = faker.internet.userName();
  socket.write(`Your name is ${client.nickname}\n`);

  // Events
  socket.on('data', (data) => {
    const message = data.toString().trim();

    logger.log(logger.INFO, `Processing a message: ${message}`);

    if (parseCommand(message, client)) {
      return;
    }

    clients.forEach((user) => {
      if (user.socket !== socket) {
        user.socket.write(`${client.nickname}: ${message}\n`);
      }
    });
  });
  socket.on('close', removeClient(socket));
  socket.on('error', () => {
    logger.log(logger.ERROR, client.nickname);
    removeClient(socket)();
  });
});

const server = module.exports = {};

server.start = () => {
  if (!process.env.PORT) {
    logger.log(logger.ERROR, 'missing PORT');
    throw new Error('missing PORT');
  }
  logger.log(logger.INFO, `Server is up on PORT ${process.env.PORT}`);
  return app.listen({ port: process.env.PORT }, () => {});
};

server.stop = () => {
  logger.log(logger.INFO, 'server is offline');
  return app.close(() => {});
};

