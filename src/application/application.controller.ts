import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AuthorizedUser } from 'src/user/interface/user.interface';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';

@ApiTags('application')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  create(@Request() req, @Body() createApplicationDto: CreateApplicationDto) {
    const user: AuthorizedUser = req.user;
    return this.applicationService.create(createApplicationDto, user);
  }

  @Get()
  @UsePipes(ValidationPipe)
  findAll() {
    return this.applicationService.findAll();
  }

  @Get(':id')
  @UsePipes(ValidationPipe)
  async findOne(@Request() req, @Param('id') id: string) {
    const user: AuthorizedUser = req.user;
    const application = await this.applicationService.findOneById(id);
    if (String(application.admin) !== user.id) {
      throw new UnauthorizedException();
    }
    delete application.admin;
    return application;
  }

  //   @Put(':id')
  //   @UsePipes(ValidationPipe)
  //   update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
  //     return this.applicationService.update(+id, updateApplicationDto);
  //   }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  async remove(@Request() req, @Param('id') id: string) {
    const user: AuthorizedUser = req.user;
    const application = await this.applicationService.findOneById(id);
    if (application === null) {
      throw new NotFoundException();
    }
    if (String(application.admin) !== user.id) {
      throw new UnauthorizedException();
    }
    await application.remove();
    return 'removed';
  }
}
