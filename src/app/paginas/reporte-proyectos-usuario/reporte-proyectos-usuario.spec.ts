import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteProyectosUsuario } from './reporte-proyectos-usuario';

describe('ReporteProyectosUsuario', () => {
  let component: ReporteProyectosUsuario;
  let fixture: ComponentFixture<ReporteProyectosUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteProyectosUsuario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteProyectosUsuario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
