import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import express, { json } from 'express';

import errorHandler from './middlewares/errorHandler.ts';
import { setupHotelWebSocket } from './server/wsHotelhandler.ts';

const allowedOrigins = ['http://localhost:3000']

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST']
  }
});

app.use(json());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use('/health', (req, res) => {
  res.send('Ok')
})

app.use(errorHandler);

setupHotelWebSocket(io);

httpServer.listen(8080, () => {
  console.log('Server is running on port 8080');
});

export default app;