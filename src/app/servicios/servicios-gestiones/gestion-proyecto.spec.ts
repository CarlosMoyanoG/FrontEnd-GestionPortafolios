import { TestBed } from '@angular/core/testing';

import { GestionProyecto } from './gestion-proyecto';

describe('GestionProyecto', () => {
  let service: GestionProyecto;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionProyecto);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
