import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentsResolver } from './documents.resolver';
import { Document } from './entities/document.entity';
import { Organization } from '../organizations/entities/organization.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Organization])],
  providers: [DocumentsResolver, DocumentsService],
})
export class DocumentsModule {}
