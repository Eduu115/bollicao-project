import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nosotros } from './nosotros';

describe('Nosotros', () => {
  let component: Nosotros;
  let fixture: ComponentFixture<Nosotros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nosotros]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nosotros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
