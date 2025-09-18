import { JobResponse } from 'src/jobs/dto';
import { Organization } from 'src/organizations/entities/organization.entity';
import { RtrTemplateCandidateInput } from '../dto/compiled-rtr-template.input';
import { RTRTemplateContext } from '../types/template-context';
import { formattedTemplateValue, getNestedValue } from '../lib/utils';
import Handlebars from 'handlebars';

export class RtrTemplateServiceHelper {
  constructor() {}

  registerHandlebarsHelpers() {
    Handlebars.registerHelper('safeVar', function (this: any, key: string) {
      const value = getNestedValue(this, key);
      if (value === undefined || value === null) return `{{${key}}}`;
      return value;
    });
  }

  getHtmlContext(jobData: JobResponse, orgData: Organization, candidate?: RtrTemplateCandidateInput): RTRTemplateContext {
    const response = { candidate: {}, job: {} };
    response.candidate['firstName'] = formattedTemplateValue(candidate?.firstName);
    response.candidate['lastName'] = formattedTemplateValue(candidate?.lastName);
    response.candidate['email'] = formattedTemplateValue(candidate?.email);
    response.candidate['phone'] = formattedTemplateValue(candidate?.phone);
    response.job['title'] = jobData.title ? formattedTemplateValue(jobData.title) : jobData.title;
    response.job['description'] = jobData.description ? formattedTemplateValue(jobData.description) : jobData.description;
    response.job['company'] = orgData.name ? formattedTemplateValue(orgData.name) : orgData.name;
    return response;
  }

  getTextContext(jobData: JobResponse, orgData: Organization, candidate?: RtrTemplateCandidateInput): RTRTemplateContext {
    return { candidate, job: { title: jobData.title, description: jobData.description, company: orgData.name } };
  }
}
