import { Crypto } from '../../../core/infrastructure/security/crypto';
import { UserInputDTO } from '../dtos';
import { UserRepository } from '../repository';
import { User } from '../../domain/entity';
import { UserValidator } from '../../domain/validator';

export class UserUseCase {
  private readonly repository: UserRepository;
  private readonly validator: UserValidator;
  private readonly crypto: Crypto;

  constructor({ repository }: { repository: UserRepository }) {
    this.repository = repository;
    this.validator = new UserValidator();
    this.crypto = new Crypto();
  }

  public async create({ name, password, email }: UserInputDTO): Promise<User> {
    this.validator.name({ name });
    this.validator.password({ password });
    this.validator.email({ email });

    const exists = await this.repository.exists({ email });
    if (exists) throw new Error('email already in use');
    const hashed = await this.crypto.hash({ value: password });
    return await this.repository.createOne({ email, name, password: hashed });
  }
}
