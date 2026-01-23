import { TestBed } from '@angular/core/testing';

import { GestionAsesoria } from './gestion-asesoria';

describe('GestionAsesoria', () => {
  let service: GestionAsesoria;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionAsesoria);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
