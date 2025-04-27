import { UserFilterDTO } from '../../application/dtos';

export class UserValidator {
  public name({ name }: UserFilterDTO): void {
    if (!name) throw new Error('name is required');
    if (typeof name !== 'string') throw new Error('name must be a string');
    if (name.length < 8) throw new Error('name must be at least 8 characters long');
  }

  public password({ password }: UserFilterDTO): void {
    if (!password) throw new Error('password is required');
    if (typeof password !== 'string') throw new Error('password must be a string');
    if (password.length < 8) throw new Error('password must be at least 8 characters long');
  }

  public email({ email }: UserFilterDTO): void {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) throw new Error('email is required');
    if (typeof email !== 'string') throw new Error('email must be a string');
    if (!regex.test(email)) throw new Error('invalid email format');
  }
}
