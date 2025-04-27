import bcrypt from 'bcryptjs';
import { config } from '../../config';
import { randomBytes } from 'crypto';

export class Crypto {
  private readonly salt: number;

  constructor() {
    this.salt = config.security.salt;
  }

  async hash({ value }: { value: string }): Promise<string> {
    return await bcrypt.hash(value, this.salt);
  }

  async compare({ value, hashed }: { value: string; hashed: string }): Promise<boolean> {
    return await bcrypt.compare(value, hashed);
  }

  async generate(): Promise<string> {
    return await randomBytes(config.security.bytes).toString('hex');
  }
}
