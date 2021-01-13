import RegistrationNumberWorker from '@vitspot/vit-registration-number';

import { ConflictException, Injectable, Logger } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';
import { UserRepository } from './user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
/**
 * **User Service**
 *
 * User Service contains all business logic related to users, and is designed to be
 * imported and re-used in other modules. Therefore it is to ensure that all methods of the service
 * are self-contained and fit to be used directly as per use-case.
 *
 * @category User
 */
@Injectable()
export class UserService {
  private readonly logger = new Logger('user');

  constructor(
    private readonly userRepository: UserRepository,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { registrationNumber } = createUserDto;
      let { password, collegeEmail } = createUserDto;

      const regNumber = new RegistrationNumberWorker(registrationNumber);
      const branch = regNumber.getBranch();
      const batch = regNumber.getYear();
      password = await bcrypt.hash(password, 10);
      collegeEmail = collegeEmail.toLowerCase();

      const user = new this.userModel({ ...createUserDto, collegeEmail, branch, batch, password });
      await user.save();

      return user;
    } catch (e) {
      throw new ConflictException(e.message);
    }
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
