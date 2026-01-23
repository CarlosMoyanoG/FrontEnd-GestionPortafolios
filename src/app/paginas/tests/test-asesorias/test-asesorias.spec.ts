import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestAsesorias } from './test-asesorias';

describe('TestAsesorias', () => {
  let component: TestAsesorias;
  let fixture: ComponentFixture<TestAsesorias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAsesorias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestAsesorias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
