/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MedalCountryChartComponent } from './medal-country-chart.component';

describe('MedalCountryChartComponent', () => {
  let component: MedalCountryChartComponent;
  let fixture: ComponentFixture<MedalCountryChartComponent>;

  beforeEach((async () => {
    TestBed.configureTestingModule({
      declarations: [ MedalCountryChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedalCountryChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
