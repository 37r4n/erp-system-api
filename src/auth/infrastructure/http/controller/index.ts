import { Response } from 'express';
import { AuthUseCase } from '../../../application/case';
import { UserAdapter } from '../../../../user';
import { SessionAdapter } from '../../../../session';

export class AuthController {
  private readonly case: AuthUseCase;
  private readonly userRepository: UserAdapter;
  private readonly sessionRepository: SessionAdapter;

  constructor() {
    this.userRepository = new UserAdapter();
    this.sessionRepository = new SessionAdapter();
    this.case = new AuthUseCase({ userRepository: this.userRepository, sessionRepository: this.sessionRepository });
  }

  public register = async (req: any, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    const token = await this.case.register({ name, email, password });
    res.json({ success: true, message: 'user registered successfully', data: { token } });
  };

  public login = async (req: any, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const token = await this.case.login({ email, password });
    res.json({ message: 'user logged in successfully', data: { token } });
  };

  public logout = async (req: any, res: Response): Promise<void> => {
    const header = req.headers['authorization'];
    if (!header) throw new Error('authorization header is missing');
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) throw new Error('invalid token format');
    await this.case.logout({ token });
    res.json({ success: true, message: 'user logged out successfully' });
  };

  public refresh = async (req: any, res: Response): Promise<void> => {
    const header = req.headers['authorization'];
    if (!header) throw new Error('authorization header is missing');
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) throw new Error('invalid token format');
    const newToken = await this.case.refresh({ token });
    res.json({ success: true, message: 'user refreshed successfully', data: { token: newToken } });
  };
}
