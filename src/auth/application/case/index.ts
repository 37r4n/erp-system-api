import { config } from '../../../core/infrastructure/config';
import { Crypto } from '../../../core/infrastructure/security/crypto';
import { SessionFilterDTO, SessionRepository } from '../../../session';
import { User, UserFilterDTO, UserRepository, UserValidator } from '../../../user';

export class AuthUseCase {
  private readonly userRepository: UserRepository;
  private readonly sessionRepository: SessionRepository;
  private readonly userValidator: UserValidator;

  private readonly crypto: Crypto;

  constructor({ userRepository, sessionRepository }: { userRepository: UserRepository; sessionRepository: SessionRepository }) {
    this.userRepository = userRepository;
    this.sessionRepository = sessionRepository;
    this.userValidator = new UserValidator();
    this.crypto = new Crypto();
  }

  public async register({ name, password, email }: UserFilterDTO): Promise<void> {
    if (!name) throw new Error('name is required');
    if (!password) throw new Error('password is required');
    if (!email) throw new Error('email is required');
    this.userValidator.name({ name });
    this.userValidator.password({ password });
    this.userValidator.email({ email });

    const exists = await this.userRepository.exists({ email });
    if (exists) throw new Error('email already exists');

    const hashedPassword = await this.crypto.hash({ value: password });

    await this.userRepository.createOne({ name, password: hashedPassword, email });
  }

  public async login({ email, password }: UserFilterDTO): Promise<string> {
    if (!email) throw new Error('email is required');
    if (!password) throw new Error('password is required');
    this.userValidator.email({ email });
    this.userValidator.password({ password });

    const user = await this.userRepository.findOne({ where: { email, is_active: true } });
    if (!user) throw new Error('invalid credentials');

    const valid = await this.crypto.compare({ value: password, hashed: user.password });
    if (!valid) throw new Error('invalid credentials');

    const token = await this.crypto.generate();
    const hashedToken = await this.crypto.hash({ value: token });
    const expires_at = new Date();
    expires_at.setSeconds(expires_at.getSeconds() + config.security.expires);

    await this.sessionRepository.createOne({ expires_at, user_id: user.id, token: hashedToken });
    return token;
  }

  public async logout({ token }: SessionFilterDTO): Promise<void> {
    if (!token) throw new Error('token is required');

    const date = new Date();

    const sessions = await this.sessionRepository.findMany({ where: { is_revoked: false, expires_at: { gt: date } } });

    for (const session of sessions) {
      const valid = await this.crypto.compare({ value: token, hashed: session.token });

      if (valid) {
        await this.sessionRepository.updateMany({ where: { user_id: session.user_id }, data: { is_revoked: true, revoked_at: date } });
        return;
      }
    }

    throw new Error('invalid token');
  }

  public async refresh({ token }: SessionFilterDTO): Promise<string> {
    if (!token) throw new Error('token is required');

    const date = new Date();

    const sessions = await this.sessionRepository.findMany({ where: { is_revoked: false, expires_at: { gt: date } } });

    for (const session of sessions) {
      const valid = await this.crypto.compare({ value: token, hashed: session.token });

      if (valid) {
        await this.sessionRepository.updateMany({ where: { user_id: session.user_id }, data: { is_revoked: true, revoked_at: date } });
        const newToken = await this.crypto.generate();
        const hashedNewToken = await this.crypto.hash({ value: newToken });
        const expires_at = new Date();
        expires_at.setSeconds(expires_at.getSeconds() + config.security.expires);
        await this.sessionRepository.createOne({ expires_at, user_id: session.user_id, token: hashedNewToken });
        return newToken;
      }
    }

    throw new Error('invalid token');
  }

  public async me({ token }: SessionFilterDTO): Promise<User | null> {
    if (!token) throw new Error('token is required');

    const sessions = await this.sessionRepository.findMany({ where: { is_revoked: false, expires_at: { gt: new Date() } } });

    for (const session of sessions) {
      const valid = await this.crypto.compare({ value: token, hashed: session.token });

      if (valid) {
        const user = await this.userRepository.findOne({ where: { id: session.user_id } });
        if (user) return user;
      }
    }

    return null;
  }
}
