import { PartialType } from '@nestjs/mapped-types';
import { InputType } from '@nestjs/graphql';
import { CreateJobInput } from './create-job.dto';

@InputType()
export class UpdateJobInput extends PartialType(CreateJobInput) {}
