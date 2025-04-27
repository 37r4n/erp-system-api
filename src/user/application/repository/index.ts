import { User } from '../../domain/entity';
import { UserFilterDTOWithOperators, UserInputDTO, UserPaginatedDTO, UserUpdateDTO } from '../dtos';

export interface UserRepository {
  findMany({ where }: { where?: UserFilterDTOWithOperators }): Promise<User[]>;
  findOne({ where }: { where?: UserFilterDTOWithOperators }): Promise<User | null>;
  createOne(data: UserInputDTO): Promise<User>;
  updateMany({ where }: { where: UserFilterDTOWithOperators; data: UserUpdateDTO }): Promise<number>;
  updateOne({ where }: { where: UserFilterDTOWithOperators; data: UserUpdateDTO }): Promise<User>;
  deleteMany({ where }: { where: UserFilterDTOWithOperators }): Promise<number>;
  deleteOne({ where }: { where: UserFilterDTOWithOperators }): Promise<void>;
  count({ where }: { where?: UserFilterDTOWithOperators }): Promise<number>;
  exists(where?: UserFilterDTOWithOperators): Promise<boolean>;
  upsert({ where }: { where: UserFilterDTOWithOperators; data: UserInputDTO }): Promise<User>;
  paginate({ where, page, limit }: { where?: UserFilterDTOWithOperators; page?: number; limit?: number }): Promise<UserPaginatedDTO>;
}
