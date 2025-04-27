import express, { Application, json } from 'express';
import { config } from '../../config';
import { Middleware } from '../middleware';
import { AuthRouter } from '../../../../auth/infrastructure/http/router';

export class Server {
  private app: Application;
  private middleware: Middleware;
  private port: number;

  constructor() {
    this.app = express();
    this.middleware = new Middleware();
    this.port = config.app.port;
    this.setup();
  }

  private setup(): void {
    this.app.use(json());
    this.app.use(this.middleware.format);
    this.router();
    this.app.use(this.middleware.error);
  }

  private router(): void {
    const authRouter = new AuthRouter();

    this.app.use('/api/v1/auth', authRouter.router);
  }

  public run(): void {
    this.app.listen(this.port, () => {
      console.log(`Server running on http://localhost:${this.port}`);
    });
  }
}
