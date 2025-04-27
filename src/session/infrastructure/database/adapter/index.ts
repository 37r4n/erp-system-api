import { SessionRepository } from '../../../application/repository';
import { SessionFilterDTO, SessionInputDTO, SessionPaginatedDTO, SessionUpdateDTO } from '../../../application/dtos';
import { Session } from '../../../domain/entity';
import { PrismaClient } from '@prisma/client';

export class SessionAdapter implements SessionRepository {
  private readonly database: PrismaClient;

  constructor() {
    this.database = new PrismaClient();
  }

  public async findMany({ where }: { where?: SessionFilterDTO }): Promise<Session[]> {
    const raws = await this.database.session.findMany({ where: { ...where, deleted_at: null } });
    return raws.map((raw) => new Session(raw));
  }

  public async findOne({ where }: { where: SessionFilterDTO }): Promise<Session | null> {
    const raw = await this.database.session.findFirst({ where: { ...where, deleted_at: null } });
    if (!raw) return null;
    return new Session(raw);
  }

  public async createOne(data: SessionInputDTO): Promise<Session> {
    const raw = await this.database.session.create({ data });
    return new Session(raw);
  }

  public async updateMany({ where, data }: { where: SessionFilterDTO; data: SessionUpdateDTO }): Promise<number> {
    const rows = await this.database.session.updateMany({ where: { ...(where as any), deleted_at: null }, data });
    return rows.count;
  }

  public async updateOne({ where, data }: { where: SessionFilterDTO; data: SessionUpdateDTO }): Promise<Session> {
    const exists = await this.database.session.findFirst({ where: { ...where, deleted_at: null } });
    if (!exists) throw new Error('session not found');
    const raw = await this.database.session.update({ where: { ...(where as any), deleted_at: null }, data });
    return new Session(raw);
  }

  public async deleteMany({ where }: { where: SessionFilterDTO }): Promise<number> {
    const deleted_at = new Date();
    const rows = await this.database.session.updateMany({ where: where as any, data: { deleted_at } });
    return rows.count;
  }

  public async deleteOne({ where }: { where: SessionFilterDTO }): Promise<void> {
    const deleted_at = new Date();
    await this.database.session.update({ where: where as any, data: { deleted_at } });
  }

  public async count({ where }: { where: SessionFilterDTO }): Promise<number> {
    return this.database.session.count({ where: { ...where, deleted_at: null } });
  }

  public async exists(where: SessionFilterDTO): Promise<boolean> {
    const count = await this.database.session.count({ where: { ...where, deleted_at: null } });
    return count > 0;
  }

  public async upsert({ where, data }: { where: SessionFilterDTO; data: SessionInputDTO }): Promise<Session> {
    const raw = await this.database.session.upsert({ where: { ...(where as any), deleted_at: null }, create: data, update: data });
    return new Session(raw);
  }

  public async paginate({ where = {}, page = 1, limit = 10 }: { where?: SessionFilterDTO; page?: number; limit?: number }): Promise<SessionPaginatedDTO> {
    const total = await this.database.session.count({ where: { ...where, deleted_at: null } });
    const pages = Math.max(Math.ceil(total / limit), 1);
    const skip = (page - 1) * limit;
    const raws = await this.database.session.findMany({ where: { ...where, deleted_at: null }, skip, take: limit });
    const data = raws.map((raw) => new Session(raw));
    return { data, meta: { page, limit, count: total, pages } };
  }
}
