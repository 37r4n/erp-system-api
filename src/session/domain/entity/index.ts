import { SessionResponseDTO } from '../../application/dtos';

export class Session {
  public readonly id: string;
  public readonly token: string;
  public readonly user_id: string;
  public readonly is_revoked: boolean;
  public readonly revoked_at: Date | null;
  public readonly expires_at: Date;
  public readonly created_at: Date;
  public readonly updated_at: Date;

  constructor({ id, token, user_id, is_revoked, revoked_at, expires_at, created_at, updated_at }: SessionResponseDTO) {
    this.id = id;
    this.token = token;
    this.user_id = user_id;
    this.is_revoked = is_revoked;
    this.revoked_at = revoked_at || null;
    this.expires_at = expires_at;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
