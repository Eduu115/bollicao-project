import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Main } from './components/main/main';
import { Footer } from './components/footer/footer';
import { Hero } from "./components/hero/hero";
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Hero, Navbar, Footer, Main],
  templateUrl:'./app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bollicao');
}
