import { TestBed } from '@angular/core/testing';

import { GestionProgramador } from './gestion-programador';

describe('GestionProgramador', () => {
  let service: GestionProgramador;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionProgramador);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
