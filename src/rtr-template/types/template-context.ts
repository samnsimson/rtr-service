export interface RTRTemplateContext {
  candidate?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  job?: {
    title?: string;
    description?: string;
    company?: string;
  };
}
