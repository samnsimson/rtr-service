import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateUserInput, UpdateUserInput } from './dto';
import { User } from './entities/user.entity';
import { UserRole } from '../common/enums';
import { UserServiceHelper } from './helpers/user-service.helper';

@Injectable()
export class UsersService extends UserServiceHelper {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    super();
  }

  async create(createUserInput: CreateUserInput): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { email: createUserInput.email } });
    if (existingUser) throw new ConflictException('User with this email already exists');
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    const user = this.userRepository.create({ ...createUserInput, password: hashedPassword });
    return this.userRepository.save(user);
  }

  async findAll(options: FindManyOptions<User> = {}): Promise<User[]> {
    return this.userRepository.find({ ...options, order: { createdAt: 'DESC' } });
  }

  async findOne(id: string, options: FindOneOptions<User> = {}): Promise<User> {
    if (!id) throw new BadRequestException('User ID is required');
    const user = await this.userRepository.findOne({ where: { id, ...options.where }, relations: ['organization'] });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    if (!email) throw new BadRequestException('Email is required');
    const user = await this.userRepository.findOne({ where: { email }, relations: ['organization'] });
    if (!user) throw new NotFoundException(`User with email ${email} not found`);
    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    if (!id) throw new BadRequestException('User ID is required');
    const user = await this.findOne(id);
    if (updateUserInput.password) updateUserInput.password = await bcrypt.hash(updateUserInput.password, 10);
    Object.assign(user, updateUserInput);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    if (!id) throw new BadRequestException('User ID is required');
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async findOneWithPassword(id: string): Promise<User> {
    if (!id) throw new BadRequestException('User ID is required');
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async validateUser(email: string, password: string): Promise<User> {
    if (!email || !password) throw new BadRequestException('Email and password are required');
    const user = await this.userRepository.findOne({ where: { email }, relations: ['organization'] });
    if (!user) throw new NotFoundException('Invalid credentials');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new NotFoundException('Invalid credentials');
    return user;
  }

  async count(): Promise<number> {
    return this.userRepository.count();
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { id } });
    return count > 0;
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.find({ where: { role }, order: { createdAt: 'DESC' } });
  }
}
