import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export function errorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const router = inject(Router);

  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response && event.status === 401) {
        router.navigateByUrl('login');
      }
    })
  );
}
