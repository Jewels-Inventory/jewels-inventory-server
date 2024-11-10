/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Device } from '../../models/device';

export interface UpdateMyJewel_1$Params {
  ownerId: string;
  deviceId: string;
  body?: Device;
}

export function updateMyJewel_1(
  http: HttpClient,
  rootUrl: string,
  params: UpdateMyJewel_1$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, updateMyJewel_1.PATH, 'put');
  if (params) {
    rb.path('ownerId', params.ownerId, {});
    rb.path('deviceId', params.deviceId, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(rb.build({ responseType: 'text', accept: '*/*', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
    })
  );
}

updateMyJewel_1.PATH = '/api/admin/owner/{ownerId}/device/{deviceId}';
