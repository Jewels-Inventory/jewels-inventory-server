/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Device } from '../../models/device';

export interface GetJewelsByOwner$Params {
  ownerId: string;
}

export function getJewelsByOwner(
  http: HttpClient,
  rootUrl: string,
  params: GetJewelsByOwner$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Array<Device>>> {
  const rb = new RequestBuilder(rootUrl, getJewelsByOwner.PATH, 'get');
  if (params) {
    rb.path('ownerId', params.ownerId, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<Device>>;
    })
  );
}

getJewelsByOwner.PATH = '/api/admin/owner/{ownerId}/device';
