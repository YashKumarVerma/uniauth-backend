import * as mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import { User } from 'src/user/user.schema';

export type ApplicationDocument = Application & Document;

@Schema()
export class Application {
  constructor(partial: Partial<Application>) {
    Object.assign(this, partial);
  }

  /** Application information */
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  admin: User;

  @Prop({ required: true })
  supportEmail: string;

  @Prop()
  description: string;

  /** Application Configuration */
  @Prop({ required: true, type: [String] })
  authorizedOrigin: Array<string>;

  @Prop({ required: true, type: [String] })
  authorizedRedirect: Array<string>;

  @Prop({ required: true, type: [String] })
  scope: Array<string>;

  /** applicaiton keys */
  @Prop({ required: true })
  clientSecret: string;

  @Prop({ required: true, type: Date })
  creationDate: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
