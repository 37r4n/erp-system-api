import { UserRepository } from '../../../application/repository';
import { UserFilterDTO, UserInputDTO, UserPaginatedDTO, UserUpdateDTO } from '../../../application/dtos';
import { User } from '../../../domain/entity';
import { PrismaClient } from '@prisma/client';

export class UserAdapter implements UserRepository {
  private readonly database: PrismaClient;

  constructor() {
    this.database = new PrismaClient();
  }

  public async findMany({ where }: { where?: UserFilterDTO }): Promise<User[]> {
    const raws = await this.database.user.findMany({ where: { ...where, deleted_at: null } });
    return raws.map((raw) => new User(raw));
  }

  public async findOne({ where }: { where: UserFilterDTO }): Promise<User | null> {
    const raw = await this.database.user.findFirst({ where: { ...where, deleted_at: null } });
    if (!raw) return null;
    return new User(raw);
  }

  public async createOne(data: UserInputDTO): Promise<User> {
    const raw = await this.database.user.create({ data });
    return new User(raw);
  }

  public async updateMany({ where, data }: { where: UserFilterDTO; data: UserUpdateDTO }): Promise<number> {
    const rows = await this.database.user.updateMany({ where: { ...(where as any), deleted_at: null }, data });
    return rows.count;
  }

  public async updateOne({ where, data }: { where: UserFilterDTO; data: UserUpdateDTO }): Promise<User> {
    const exists = await this.database.user.findFirst({ where: { ...where, deleted_at: null } });
    if (!exists) throw new Error('user not found');
    const raw = await this.database.user.update({ where: { ...(where as any), deleted_at: null }, data });
    return new User(raw);
  }

  public async deleteMany({ where }: { where: UserFilterDTO }): Promise<number> {
    const deleted_at = new Date();
    const rows = await this.database.user.updateMany({ where: where as any, data: { deleted_at } });
    return rows.count;
  }

  public async deleteOne({ where }: { where: UserFilterDTO }): Promise<void> {
    const deleted_at = new Date();
    await this.database.user.update({ where: where as any, data: { deleted_at } });
  }

  public async count({ where }: { where: UserFilterDTO }): Promise<number> {
    return this.database.user.count({ where: { ...where, deleted_at: null } });
  }

  public async exists(where: UserFilterDTO): Promise<boolean> {
    const count = await this.database.user.count({ where: { ...where, deleted_at: null } });
    return count > 0;
  }

  public async upsert({ where, data }: { where: UserFilterDTO; data: UserInputDTO }): Promise<User> {
    const raw = await this.database.user.upsert({ where: { ...(where as any), deleted_at: null }, create: data, update: data });
    return new User(raw);
  }

  public async paginate({ where = {}, page = 1, limit = 10 }: { where?: UserFilterDTO; page?: number; limit?: number }): Promise<UserPaginatedDTO> {
    const total = await this.database.user.count({ where: { ...where, deleted_at: null } });
    const pages = Math.max(Math.ceil(total / limit), 1);
    const skip = (page - 1) * limit;
    const raws = await this.database.user.findMany({ where: { ...where, deleted_at: null }, skip, take: limit });
    const data = raws.map((raw) => new User(raw));
    return { data, meta: { page, limit, count: total, pages } };
  }
}
