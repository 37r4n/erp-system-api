import { UserResponseDTO } from '../../application/dtos';

export class User {
  public readonly id: string;
  public readonly email: string;
  public readonly name: string;
  public readonly password: string;
  public readonly is_active: boolean;
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor({ id, name, password, email, is_active, created_at, updated_at }: UserResponseDTO) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.password = password;
    this.is_active = is_active;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
