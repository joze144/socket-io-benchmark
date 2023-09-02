import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import promBundle from 'express-prom-bundle';

const app = express();

app.use(promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  customLabels: { app: 'socket-io-benchmark' },
  promClient: {
    collectDefaultMetrics: {
      labels: { app: 'socket-io-benchmark' },
      gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    },
  },
}));

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {

  // First test case, pairs of users in the same room
  if (socket.handshake.query.room) {
    socket.join(socket.handshake.query.room);
    console.info('joined room', socket.handshake.query.room)
    socket.on(socket.handshake.query.room as string, (msg) => {
      socket.to(socket.handshake.query.room as string).emit('message', msg);
    });
    return;
  }

  // Second test case, a bunch of connections
  setInterval(() => {
    socket.emit("server to client event", 1, "2", { 3: Buffer.from([4]) });
  }, parseInt(socket.handshake.query['emit-interval'] as string, 10))

  // receive a message from the client
  socket.on("client to server event", (...args) => {
    // ...
  });
});

app.get('/', (req, res) => {
  res.send({message: 'Hello to the Socket.IO benchmark!'});
});
