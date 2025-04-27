import { OperatorsDTO, PaginatedDTO } from '../../../core/application/dtos';

export interface SessionResponseDTO {
  id: string;
  token: string;
  user_id: string;
  is_revoked: boolean;
  revoked_at: Date | null;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface SessionFilterDTO {
  id?: string;
  token?: string;
  user_id?: string;
  is_revoked?: boolean;
  revoked_at?: Date;
  expires_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface SessionFilterDTOWithOperators {
  id?: string | OperatorsDTO<string>;
  token?: string | OperatorsDTO<string>;
  user_id?: string | OperatorsDTO<string>;
  is_revoked?: boolean | OperatorsDTO<boolean>;
  revoked_at?: Date | OperatorsDTO<Date>;
  expires_at?: Date | OperatorsDTO<Date>;
  created_at?: Date | OperatorsDTO<Date>;
  updated_at?: Date | OperatorsDTO<Date>;
}

export interface SessionInputDTO {
  token: string;
  user_id: string;
  expires_at: Date;
}

export interface SessionUpdateDTO {
  token?: string;
  is_revoked?: boolean;
  revoked_at?: Date;
}

export interface SessionPaginatedDTO extends PaginatedDTO<SessionResponseDTO> {}
