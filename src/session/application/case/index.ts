import { Crypto } from '../../../core/infrastructure/security/crypto';
import { SessionInputDTO } from '../dtos';
import { SessionRepository } from '../repository';
import { Session } from '../../domain/entity';
import { config } from '../../../core/infrastructure/config';

export class SessionUseCase {
  private readonly sessionRepository: SessionRepository;
  private readonly crypto: Crypto;

  constructor({ sessionRepository }: { sessionRepository: SessionRepository }) {
    this.sessionRepository = sessionRepository;
    this.crypto = new Crypto();
  }

  public async create({ user_id }: SessionInputDTO): Promise<Session> {
    if (!user_id) throw new Error('user_id is required');

    const token = await this.crypto.generate();
    const hash = await this.crypto.hash({ value: token });
    const expires_at = new Date();
    expires_at.setSeconds(expires_at.getSeconds() + config.security.expires);

    await this.sessionRepository.updateMany({ where: { user_id }, data: { is_revoked: true } });
    return await this.sessionRepository.createOne({ token: hash, user_id, expires_at });
  }
}
