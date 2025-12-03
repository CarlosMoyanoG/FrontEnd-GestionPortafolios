import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Autenticacion } from '../servicios/autenticacion';

export const adminGuard: CanActivateFn = (route, state) => {

    const auth = inject(Autenticacion);
    const router = inject(Router);

    console.log('Guard admin, rol actual:', auth.usuarioActual.rol);

    if (auth.esAdmin()) {
      return true;
    }

    console.warn('Acceso denegado: se requiere rol admin');
    return router.parseUrl('/inicio');
};
