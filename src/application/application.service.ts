import { CreateApplicationDto } from './dto/create-application.dto';
import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Application, ApplicationDocument } from './application.schema';
import { isValidObjectId, Model, ObjectId } from 'mongoose';
import { v4 as generateUUID } from 'uuid';
import { AuthorizedUser } from 'src/user/interface/user.interface';
import { User } from 'src/user/user.schema';

@Injectable()
export class ApplicationService {
  private readonly logger = new Logger('application');

  // private readonly applicationRepository: UserRepository,
  constructor(@InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>) {}

  async create(createApplicationDto: CreateApplicationDto, authorizedUser: AuthorizedUser): Promise<Application> {
    try {
      const clientSecret = generateUUID();
      const creationDate = new Date();
      const newApplication = new this.applicationModel({
        ...createApplicationDto,
        clientSecret,
        creationDate,
        admin: authorizedUser.id,
      });

      await newApplication.save();
      return newApplication;
    } catch (e) {
      this.logger.error(e);
      throw new ConflictException(e.message);
    }
  }

  findAll() {
    return this.applicationModel.find();
  }

  async findOneById(id: string) {
    if (isValidObjectId(id)) {
      const item = await this.applicationModel.findOne({ _id: id });
      return item;
    } else {
      throw new BadRequestException();
    }
  }

  /** to return details of applications created by user */
  async findAllByOwner(user: User): Promise<Array<Application>> {
    const item = await this.applicationModel.find({ admin: user });
    return item;
  }

  remove(id: string) {
    return this.applicationModel.deleteOne({ _id: id });
  }
}
