import { CreateApplicationDto } from './dto/create-application.dto';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Application, ApplicationDocument } from './application.schema';
import { Model } from 'mongoose';
import { v4 as generateUUID } from 'uuid';
import { AuthorizedUser } from 'src/user/interface/user.interface';

@Injectable()
export class ApplicationService {
  private readonly logger = new Logger('application');

  // private readonly applicationRepository: UserRepository,
  constructor(@InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>) {}

  async create(createApplicationDto: CreateApplicationDto, authorizedUser: AuthorizedUser): Promise<Application> {
    try {
      const clientId = generateUUID();
      const clientSecret = generateUUID();
      const creationDate = new Date();
      const newApplication = new this.applicationModel({
        ...createApplicationDto,
        clientId,
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

  findOneById(id: string) {
    return this.applicationModel.findOne({ _id: id });
  }

  //   update(id: number, updateApplicationDto: UpdateApplicationDto) {
  //     return `This action updates a #${id} application`;
  //   }

  remove(id: string) {
    return this.applicationModel.deleteOne({ _id: id });
  }
}
