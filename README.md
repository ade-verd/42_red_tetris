# Red Tetris

## Introduction

The goal of this project is to develop a multiplayer tetris game on the network with a set of software exclusively from Full Stack Javascript.

Front-end has been developed using latest features from ReactJS. State is managed using Redux and React Hooks.
Front-end communicates with socket server.

Socket server has been developed using NodeJS and SocketIO.
Data are stored using MongoDB.

## Objectives

Subjects: [red_tetris.fr.pdf](docs/red_tetris.fr.pdf) or [red_tetris.en.pdf](docs/red_tetris.en.pdf)

The pedagogical objectives are multiple, but the main axis is to introduce the language Javascript, to discover its abundant ecosystem and to implement some of the principles, techniques and Flagship tools of Full Stack Javascript.

Through the writing of a network Tetris game, you’ll implement functional principles (which is required), asynchronous client and server (by nature of the language) and
reagents (by nature of the game and GUI).

You will have to write unit tests that will have to be worthy of an industrial chain of continuous delivery.

You will also discover the latest popular tools and libraries the Full Stack Javascript like Node.js, React.js and Redux.js.

## Let's play !

### Install

Install [node](https://nodejs.org/en/) first. After that:

```
source requirements.sh
npm install
```

To install mongodb and mongo-express containers run:

```
npm run start-services
```

Edit `src/server/config/index.js` and `src/client/config/index.js` for your needs.

### Build and launch server

Build the project:

```
npm run srv-dist
npm run client-dist
```

And launch the node.js server listening for socket.io connexions:

```
node dist/server/main.js
```

The one-page project is now available on: http://localhost:3004

### Development

Development mode with live reload

```
npm run srv-dev
npm run client-dev
```

The one-page project is now available on: http://localhost:8080

### Tests

```
npm test
```
