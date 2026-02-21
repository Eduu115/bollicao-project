import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Contactanos } from './contactanos';

describe('Contactanos', () => {
  let component: Contactanos;
  let fixture: ComponentFixture<Contactanos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contactanos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Contactanos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
