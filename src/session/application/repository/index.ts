import { Session } from '../../domain/entity';
import { SessionFilterDTOWithOperators, SessionInputDTO, SessionPaginatedDTO, SessionUpdateDTO } from '../dtos';

export interface SessionRepository {
  findMany({ where }: { where?: SessionFilterDTOWithOperators }): Promise<Session[]>;
  findOne({ where }: { where?: SessionFilterDTOWithOperators }): Promise<Session | null>;
  createOne(data: SessionInputDTO): Promise<Session>;
  updateMany({ where }: { where: SessionFilterDTOWithOperators; data: SessionUpdateDTO }): Promise<number>;
  updateOne({ where }: { where: SessionFilterDTOWithOperators; data: SessionUpdateDTO }): Promise<Session>;
  deleteMany({ where }: { where: SessionFilterDTOWithOperators }): Promise<number>;
  deleteOne({ where }: { where: SessionFilterDTOWithOperators }): Promise<void>;
  count({ where }: { where?: SessionFilterDTOWithOperators }): Promise<number>;
  exists(where?: SessionFilterDTOWithOperators): Promise<boolean>;
  upsert({ where }: { where: SessionFilterDTOWithOperators; data: SessionInputDTO }): Promise<Session>;
  paginate({ where, page, limit }: { where?: SessionFilterDTOWithOperators; page?: number; limit?: number }): Promise<SessionPaginatedDTO>;
}
