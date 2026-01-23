import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDisponibilidades } from './test-disponibilidades';

describe('TestDisponibilidades', () => {
  let component: TestDisponibilidades;
  let fixture: ComponentFixture<TestDisponibilidades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDisponibilidades]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestDisponibilidades);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
