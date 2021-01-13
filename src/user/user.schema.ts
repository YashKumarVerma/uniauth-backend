import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  /**
   * Personal Details
   */
  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop({ required: true })
  password: string;

  /**
   * Registration Details
   */
  @Prop({ required: true })
  registrationNumber: string;

  @Prop({ required: true })
  batch: string;

  @Prop({ required: true })
  branch: string;

  /**
   * Emails
   */
  @Prop({ required: true, unique: true })
  collegeEmail: string;

  @Prop()
  personalEmail: string;

  /**
   * Contact Numbers
   */
  @Prop()
  contactPrimary: string;

  @Prop()
  contactSecondary: string;

  /**
   * Social Links
   */
  @Prop([String])
  profile: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
