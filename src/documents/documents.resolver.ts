import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DocumentsService } from './documents.service';
import { CreateDocumentInput, DocumentResponse } from './dto';

@Resolver(() => DocumentResponse)
export class DocumentsResolver {
  constructor(private readonly documentsService: DocumentsService) {}

  @Mutation(() => DocumentResponse)
  createDocument(@Args('createDocumentInput') createDocumentInput: CreateDocumentInput) {
    return this.documentsService.create(createDocumentInput);
  }

  @Query(() => [DocumentResponse], { name: 'documents' })
  findAll() {
    return this.documentsService.findAll();
  }

  @Query(() => DocumentResponse, { name: 'document' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.documentsService.findOne(id);
  }

  @Mutation(() => DocumentResponse)
  updateDocument(@Args('id', { type: () => Int }) id: number, @Args('updateDocumentInput') updateDocumentInput: CreateDocumentInput) {
    return this.documentsService.update(id, updateDocumentInput);
  }

  @Mutation(() => DocumentResponse)
  removeDocument(@Args('id', { type: () => Int }) id: number) {
    return this.documentsService.remove(id);
  }
}
