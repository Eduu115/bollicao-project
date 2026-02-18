import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { Navbar } from '../../components/navbar/navbar';
import { Main } from '../../components/main/main';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [Hero, Navbar, Main],
    template: `
    <app-hero></app-hero>
    <app-navbar></app-navbar>
    <app-main></app-main>
  `
})
export class Home { }
