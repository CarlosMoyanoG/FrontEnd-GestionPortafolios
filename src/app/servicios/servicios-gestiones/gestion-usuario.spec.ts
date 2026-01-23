import { TestBed } from '@angular/core/testing';

import { GestionUsuario } from './gestion-usuario';

describe('GestionUsuario', () => {
  let service: GestionUsuario;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionUsuario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
