import { PartialType } from '@nestjs/mapped-types';
import { InputType } from '@nestjs/graphql';
import { CreateRTRInput } from './create-rtr.dto';

@InputType()
export class UpdateRTRInput extends PartialType(CreateRTRInput) {}
