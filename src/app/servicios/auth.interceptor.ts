import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

const API_HOSTS = [
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:8081',
  'http://127.0.0.1:8081',
  'http://localhost:8002',
  'http://127.0.0.1:8002',
];

const shouldAttachToken = (url: string) => {
  return API_HOSTS.some((host) => url.startsWith(host));
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!shouldAttachToken(req.url)) {
    return next(req);
  }

  const auth = inject(Auth);
  return from(auth.authStateReady()).pipe(
    mergeMap(() => {
      const user = auth.currentUser;
      if (!user) {
        return next(req);
      }
      return from(user.getIdToken()).pipe(
        mergeMap((token) => {
          const authReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          return next(authReq);
        })
      );
    })
  );
};
