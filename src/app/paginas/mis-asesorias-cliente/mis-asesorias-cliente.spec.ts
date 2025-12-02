import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisAsesoriasCliente } from './mis-asesorias-cliente';

describe('MisAsesoriasCliente', () => {
  let component: MisAsesoriasCliente;
  let fixture: ComponentFixture<MisAsesoriasCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisAsesoriasCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisAsesoriasCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
