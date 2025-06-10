import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        full_name: dto.full_name,
        role: dto.role,
        efficiency: dto.efficiency,
      },
    });
    return user;
  }

  async findAll(filter?: { role?: string }) {
    const where = {};
    if (filter?.role) {
      Object.assign(where, { role: filter.role });
    }
    const users = await this.prisma.user.findMany({ where });
    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.full_name !== undefined && { full_name: dto.full_name }),
        ...(dto.role !== undefined && { role: dto.role }),
        ...(dto.efficiency !== undefined && { efficiency: dto.efficiency }),
      },
    });
    return user;
  }

  async remove(id: number) {
    const user = await this.prisma.user.delete({ where: { id } });
    return user;
  }

  async removeAll() {
    await this.prisma.user.deleteMany({});
  }
}
