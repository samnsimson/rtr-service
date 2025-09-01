import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';
import { CreateDocumentInput } from './dto';

@Resolver(() => Document)
export class DocumentsResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  @Mutation(() => Document)
  createDocument(@Args('createDocumentInput') createDocumentInput: CreateDocumentInput) {
    return this.documentsService.create(createDocumentInput);
  }

  @Query(() => [Document], { name: 'documents' })
  findAll() {
    return this.documentsService.findAll();
  }

  @Query(() => Document, { name: 'document' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.documentsService.findOne(id);
  }

  @Mutation(() => Document)
  updateDocument(@Args('id', { type: () => Int }) id: number, @Args('updateDocumentInput') updateDocumentInput: CreateDocumentInput) {
    return this.documentsService.update(id, updateDocumentInput);
  }

  @Mutation(() => Document)
  removeDocument(@Args('id', { type: () => Int }) id: number) {
    return this.documentsService.remove(id);
  }
}
