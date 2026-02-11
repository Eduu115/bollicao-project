import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vistas } from './vistas';

describe('Vistas', () => {
  let component: Vistas;
  let fixture: ComponentFixture<Vistas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vistas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vistas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
