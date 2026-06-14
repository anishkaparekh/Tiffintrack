import { Server } from 'socket.io';
import { verifyAccessToken } from './jwt';

let io: Server;

export const initializeSocket = (server: any): Server => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  // Authentication Middleware for socket connections
  io.use((socket: any, next) => {
    try {
      // Check auth handshake parameters
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: Token is required'));
      }

      const decoded = verifyAccessToken(token);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid or expired token'));
    }
  });

  io.on('connection', (socket: any) => {
    const userId = socket.user.id;
    const role = socket.user.role;
    
    console.log(`[Socket.IO] Client connected: User ${userId} with role ${role}`);

    // Join a private room unique to this user ID
    socket.join(userId);

    // Join a role-specific room (e.g. 'role:admin') for broad notifications
    socket.join(`role:${role}`);

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: User ${userId}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io has not been initialized yet.');
  }
  return io;
};

export const emitToUser = (userId: string, event: string, data: any): void => {
  if (io) {
    io.to(userId).emit(event, data);
  }
};

export const emitToRole = (role: string, event: string, data: any): void => {
  if (io) {
    io.to(`role:${role}`).emit(event, data);
  }
};
