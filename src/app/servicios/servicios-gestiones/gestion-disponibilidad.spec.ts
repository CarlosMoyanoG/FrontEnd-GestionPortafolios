import { TestBed } from '@angular/core/testing';

import { GestionDisponibilidad } from './gestion-disponibilidad';

describe('GestionDisponibilidad', () => {
  let service: GestionDisponibilidad;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionDisponibilidad);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
