import { Router } from 'express';
import { AuthController } from '../controller';
import { Middleware } from '../../../../core/infrastructure/http';

export class AuthRouter {
  public router: Router;
  private controller: AuthController;
  private middleware: Middleware;

  constructor() {
    this.router = Router();
    this.controller = new AuthController();
    this.middleware = new Middleware();
    this.build();
  }

  private build() {
    this.router.post('/register', this.controller.register.bind(this.controller));
    this.router.post('/login', this.controller.login.bind(this.controller));
    this.router.post('/refresh', [this.middleware.auth.bind(this.middleware)], this.controller.refresh.bind(this.controller));
    this.router.post('/logout', [this.middleware.auth.bind(this.middleware)], this.controller.logout.bind(this.controller));
  }
}
