import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestProyectos } from './test-proyectos';

describe('TestProyectos', () => {
  let component: TestProyectos;
  let fixture: ComponentFixture<TestProyectos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestProyectos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestProyectos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
