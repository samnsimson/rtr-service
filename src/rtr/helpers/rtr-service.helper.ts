import { RTR } from '../entities/rtr.entity';
import { RtrResponse } from '../dto/rtr-response.dto';

export class RtrServiceHelper {
  constructor() {}

  toRtrResponse(rtr: RTR): RtrResponse {
    return new RtrResponse({
      ...rtr,
      jobId: rtr.job['id'],
      createdById: rtr.createdBy['id'],
      candidateId: rtr.candidate ? rtr.candidate['id'] : undefined,
      recruiterId: rtr.recruiter['id'],
      rtrTemplateId: rtr.rtrTemplate['id'],
    });
  }
}
