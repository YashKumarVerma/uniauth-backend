import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';
import { Exclude } from 'class-transformer';

export type UserDocument = User & Document;

@Schema()
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  /**
   * Personal Details
   */
  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Exclude()
  @Prop({ required: true, select: false })
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
