import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestProgramadores } from './test-programadores';

describe('TestProgramadores', () => {
  let component: TestProgramadores;
  let fixture: ComponentFixture<TestProgramadores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestProgramadores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestProgramadores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
