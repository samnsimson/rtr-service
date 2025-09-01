import { PartialType } from '@nestjs/mapped-types';
import { InputType } from '@nestjs/graphql';
import { CreateJobApplicationInput } from './create-job-application.dto';

@InputType()
export class UpdateJobApplicationInput extends PartialType(CreateJobApplicationInput) {}
