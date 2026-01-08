import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteAsesorias } from './reporte-asesorias';

describe('ReporteAsesorias', () => {
  let component: ReporteAsesorias;
  let fixture: ComponentFixture<ReporteAsesorias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteAsesorias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteAsesorias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
