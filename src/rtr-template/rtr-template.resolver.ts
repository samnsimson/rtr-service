import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RtrTemplateService } from './rtr-template.service';
import { RtrTemplate } from './entities/rtr-template.entity';
import { CreateRtrTemplateInput } from './dto/create-rtr-template.input';
import { UpdateRtrTemplateInput } from './dto/update-rtr-template.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { CurrentUser } from '../common/types';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from 'src/common/enums';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RtrTemplateResponse } from './dto/rtr-template.response';
import { CompiledRtrTemplateInput } from './dto/compiled-rtr-template.input';

@Resolver(() => RtrTemplate)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.ORGANIZATION_OWNER, UserRole.ORGANIZATION_ADMIN, UserRole.RECRUITER, UserRole.RECRUITER_MANAGER)
export class RtrTemplateResolver {
  constructor(private readonly rtrTemplateService: RtrTemplateService) {}

  @Mutation(() => RtrTemplate)
  createRtrTemplate(@Args('createRtrTemplateInput') createRtrTemplateInput: CreateRtrTemplateInput, @AuthUser() user: CurrentUser) {
    return this.rtrTemplateService.create(createRtrTemplateInput, user);
  }

  @Query(() => [RtrTemplate], { name: 'rtrTemplates' })
  findAll(@AuthUser() user: CurrentUser) {
    if (!user.organizationId) throw new Error('Permission denied');
    return this.rtrTemplateService.findByOrganization(user.organizationId);
  }

  @Query(() => RtrTemplate, { name: 'rtrTemplate' })
  findOne(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUser) {
    if (!user.organizationId) throw new Error('Permission denied');
    return this.rtrTemplateService.findOne(id, user.organizationId);
  }

  @Mutation(() => RtrTemplate)
  updateRtrTemplate(@Args('updateRtrTemplateInput') updateRtrTemplateInput: UpdateRtrTemplateInput, @AuthUser() user: CurrentUser) {
    if (!user.organizationId) throw new Error('Permission denied');
    if (!updateRtrTemplateInput.id || updateRtrTemplateInput.id.trim() === '') throw new Error('RTR template ID is required');
    return this.rtrTemplateService.update(updateRtrTemplateInput.id, updateRtrTemplateInput, user.organizationId);
  }

  @Mutation(() => RtrTemplate)
  removeRtrTemplate(@Args('id', { type: () => String }) id: string, @AuthUser() user: CurrentUser) {
    if (!user.organizationId) throw new Error('Permission denied');
    return this.rtrTemplateService.remove(id, user.organizationId);
  }

  @Query(() => RtrTemplateResponse, { name: 'compiledRtrTemplate' })
  compiledTemplate(@Args('compiledTemplateInput') { templateId, jobId, candidate }: CompiledRtrTemplateInput, @AuthUser() user: CurrentUser) {
    if (!user.organizationId) throw new Error('Permission denied');
    return this.rtrTemplateService.compiledTemplate(templateId, jobId, user, candidate);
  }
}
