import { NextFunction, Response } from 'express';
import { AuthUseCase } from '../../../../auth';
import { UserAdapter } from '../../../../user';
import { SessionAdapter } from '../../../../session';

export class Middleware {
  private readonly authUseCase: AuthUseCase;
  private readonly userRepository: UserAdapter;
  private readonly sessionRepository: SessionAdapter;

  constructor() {
    this.userRepository = new UserAdapter();
    this.sessionRepository = new SessionAdapter();
    this.authUseCase = new AuthUseCase({ userRepository: this.userRepository, sessionRepository: this.sessionRepository });
  }

  public async auth(req: any, _res: Response, next: NextFunction): Promise<void> {
    const header = req.headers['authorization'];
    if (!header) throw new Error('unauthorized');
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) throw new Error('unauthorized');
    const user = await this.authUseCase.me({ token });
    if (!user) throw new Error('unauthorized');
    req.user = user;
    next();
  }

  public error(error: any, _req: any, res: Response, _next: NextFunction): void {
    const message = error.message || 'internal Server Error';
    res.json({ success: false, error: message });
  }

  public format(_req: any, res: Response, next: NextFunction): void {
    const original = res.json;
    res.json = (body: any): Response => {
      const formattedResponse: any = {};
      if (body.success !== undefined) formattedResponse.success = body.success;
      if (body.message !== null && body.message !== undefined) formattedResponse.message = body.message;
      if (body.error !== null && body.error !== undefined) formattedResponse.error = body.error;
      if (body.data !== null && body.data !== undefined) formattedResponse.data = body.data;
      return original.call(res, formattedResponse);
    };

    next();
  }
}
