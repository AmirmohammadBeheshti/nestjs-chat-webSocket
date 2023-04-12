import { Uuid } from '../types';

export const getTenantIdFromRequest = (request: any): Uuid => {
  if (request.tenantId) {
    return request.tenantId;
  }

  const tenantId =
    request.headers['tenantid'] ||
    request.headers['tenantId'] ||
    request.query['tenantid'] ||
    request.query['tenantId'];

  if (tenantId) {
    request.tenantId = tenantId;
    return tenantId;
  }
  return null;
};
