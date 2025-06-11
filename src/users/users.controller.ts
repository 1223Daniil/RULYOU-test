import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Delete,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async create(@Body() dto: CreateUserDto) {
    try {
      const user = await this.usersService.create(dto);
      return { success: true, result: { id: user.id } };
    } catch (error) {
      return { success: false, result: { error: error.message } };
    }
  }

  @Get('get')
  async findAll(@Query('role') role?: string) {
    try {
      const users = await this.usersService.findAll(
        role ? { role } : undefined,
      );
      return { success: true, result: { users } };
    } catch (error) {
      return { success: false, result: { error: error.message } };
    }
  }

  @Get('get/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { success: true, result: { users: [user] } };
  }

  @Patch('update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    const existing = await this.usersService.findOne(id);
    if (!existing) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const user = await this.usersService.update(id, dto);
    return {
      success: true,
      result: {
        id: user.id,
        full_name: user.full_name,
        role: user.role,
        efficiency: user.efficiency,
      },
    };
  }

  @Delete('delete/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const existing = await this.usersService.findOne(id);
    if (!existing) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const user = await this.usersService.remove(id);
    return {
      success: true,
      result: {
        id: user.id,
        full_name: user.full_name,
        role: user.role,
        efficiency: user.efficiency,
      },
    };
  }

  @Delete('delete')
  async removeAll() {
    try {
      await this.usersService.removeAll();
      return { success: true };
    } catch (error) {
      return { success: false, result: { error: error.message } };
    }
  }
}
