import Handlebars from 'handlebars';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRtrTemplateInput } from './dto/create-rtr-template.input';
import { UpdateRtrTemplateInput } from './dto/update-rtr-template.input';
import { RtrTemplate } from './entities/rtr-template.entity';
import { CurrentUser } from '../common/types';
import { RtrTemplateResponse } from './dto/rtr-template.response';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { JobsService } from 'src/jobs/jobs.service';
import { RtrTemplateCandidateInput } from './dto/compiled-rtr-template.input';
import { RtrTemplateServiceHelper } from './helpers/rtr-template-service.helper';

@Injectable()
export class RtrTemplateService extends RtrTemplateServiceHelper {
  constructor(
    @InjectRepository(RtrTemplate)
    private readonly rtrTemplateRepository: Repository<RtrTemplate>,
    private readonly organizationService: OrganizationsService,
    private readonly jobService: JobsService,
  ) {
    super();
  }

  async create(createRtrTemplateInput: CreateRtrTemplateInput, user: CurrentUser): Promise<RtrTemplate> {
    if (!user.organizationId) throw new ForbiddenException('Permission denied');
    const rtrTemplate = this.rtrTemplateRepository.create({ ...createRtrTemplateInput, organization: { id: user.organizationId }, author: { id: user.id } });
    return this.rtrTemplateRepository.save(rtrTemplate);
  }

  async findOne(id: string, organizationId: string): Promise<RtrTemplate> {
    if (!id) throw new NotFoundException('RTR template ID is required');
    const rtrTemplate = await this.rtrTemplateRepository.findOne({
      where: { id, organization: { id: organizationId } },
      relations: ['organization', 'author', 'rtrs'],
    });

    if (!rtrTemplate) throw new NotFoundException(`RTR template with ID ${id} not found`);
    return rtrTemplate;
  }

  async findByOrganization(organizationId: string): Promise<RtrTemplate[]> {
    return this.rtrTemplateRepository.find({
      where: { organization: { id: organizationId } },
      relations: ['organization', 'author', 'rtrs'],
    });
  }

  async update(id: string, updateRtrTemplateInput: UpdateRtrTemplateInput, organizationId: string): Promise<RtrTemplate> {
    if (!id) throw new NotFoundException('RTR template ID is required');
    const rtrTemplate = await this.findOne(id, organizationId);
    Object.assign(rtrTemplate, updateRtrTemplateInput);
    return this.rtrTemplateRepository.save(rtrTemplate);
  }

  async remove(id: string, organizationId: string): Promise<RtrTemplate> {
    if (!id) throw new NotFoundException('RTR template ID is required');
    const rtrTemplate = await this.findOne(id, organizationId);
    await this.rtrTemplateRepository.remove(rtrTemplate);
    return rtrTemplate;
  }

  async compiledTemplate(templateId: string, jobId: string, user: CurrentUser, candidate?: RtrTemplateCandidateInput): Promise<RtrTemplateResponse> {
    if (!user.organizationId) throw new ForbiddenException('Permission denied');
    this.registerHandlebarsHelpers();

    const templateCall = this.findOne(templateId, user.organizationId);
    const orgDataCall = this.organizationService.findOne(user.organizationId);
    const jobDataCall = this.jobService.findOne(jobId, user);
    const [template, orgData, jobData] = await Promise.all([templateCall, orgDataCall, jobDataCall]);

    const safeTextTemplate = template.text?.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => `{{safeVar "${key}"}}`);
    const safeHtmlTemplate = template.html?.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => `{{safeVar "${key}"}}`);
    const compiledText = Handlebars.compile(safeTextTemplate);
    const compiledHtml = Handlebars.compile(safeHtmlTemplate);

    return new RtrTemplateResponse({
      ...template,
      text: compiledText({ context: this.getTextContext(jobData, orgData, candidate) }),
      html: compiledHtml({ context: this.getHtmlContext(jobData, orgData, candidate) }),
    });
  }
}
