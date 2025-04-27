import { Server } from './core/infrastructure/http';

export const bootstrap = () => {
  const server = new Server();
  server.run();
};
