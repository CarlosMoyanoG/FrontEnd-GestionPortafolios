import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Autenticacion } from '../servicios/autenticacion';

export const programadorGuard: CanActivateFn = (route, state) => {

  const auth = inject(Autenticacion);
  const router = inject(Router);

  if (auth.esProgramador()) {
    return true;
  }

  alert('Accion no autorizada');
  return router.parseUrl('/inicio');
};
