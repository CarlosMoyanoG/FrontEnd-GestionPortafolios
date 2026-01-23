import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestUsuarios } from './test-usuarios';

describe('TestUsuarios', () => {
  let component: TestUsuarios;
  let fixture: ComponentFixture<TestUsuarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestUsuarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestUsuarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
