import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Logger,
  UsePipes,
  ValidationPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

/**
 * **User Controller**
 *
 * All routes related to user are declared here, and the decorators represent the type of request
 * they respond to. Use ValidationPipe to validate client requests, and the rules for validation are
 * defined in [[CreateUserDto]].
 *
 * The controller calls [[UserService]] for all operations.
 *
 * @category User
 */
@ApiTags('user')
@Controller('user')
export class UserController {
  private readonly logger = new Logger('user');
  constructor(private readonly userService: UserService) {}

  /**
   * Responds to: _POST(`/`)_
   *
   * Creates a new user based on data from [[CreateUserDto]].
   */
  @Post()
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  //   @UseFilters(MongoExceptionFilter)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * Responds to: _GET(`/`)_
   *
   * Lists all the users
   */
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /**
   * Responds to: _GET(`/:id`)_
   *
   * Lists details of particular user
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  /**
   * Responds to: _PUT(`/:id`)_
   *
   * To update details of user
   */
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  /**
   * Responds to: _DELETE(`/:id`)_
   *
   * To delete the user
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
