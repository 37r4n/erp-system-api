import { OperatorsDTO, PaginatedDTO } from '../../../core/application/dtos';

export interface UserResponseDTO {
  id: string;
  email: string;
  name: string;
  password: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserFilterDTO {
  id?: string;
  email?: string;
  name?: string;
  password?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface UserFilterDTOWithOperators {
  id?: string | OperatorsDTO<string>;
  email?: string | OperatorsDTO<string>;
  name?: string | OperatorsDTO<string>;
  password?: string | OperatorsDTO<string>;
  is_active?: boolean | OperatorsDTO<boolean>;
  created_at?: Date | OperatorsDTO<Date>;
  updated_at?: Date | OperatorsDTO<Date>;
}

export interface UserInputDTO {
  email: string;
  name: string;
  password: string;
}

export interface UserUpdateDTO {
  email?: string;
  name?: string;
  password?: string;
  is_active?: boolean;
}

export interface UserPaginatedDTO extends PaginatedDTO<UserResponseDTO> {}
