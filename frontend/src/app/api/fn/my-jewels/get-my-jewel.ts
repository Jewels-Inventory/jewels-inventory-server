/* tslint:disable */
/* eslint-disable */
/* Code generated by ng-openapi-gen DO NOT EDIT. */

import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { Device } from '../../models/device';

export interface GetMyJewel$Params {
  id: string;
}

export function getMyJewel(
  http: HttpClient,
  rootUrl: string,
  params: GetMyJewel$Params,
  context?: HttpContext
): Observable<StrictHttpResponse<Device>> {
  const rb = new RequestBuilder(rootUrl, getMyJewel.PATH, 'get');
  if (params) {
    rb.path('id', params.id, {});
  }

  return http.request(rb.build({ responseType: 'json', accept: 'application/json', context })).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Device>;
    })
  );
}

getMyJewel.PATH = '/api/my-jewel/{id}';
