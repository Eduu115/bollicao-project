import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { Navbar } from './components/navbar/navbar';
import { Perfil } from './vistas/perfil/perfil';
import { Main } from './components/main/main';
import { Header } from './components/header/header';
import { Hero } from './components/hero/hero';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Perfil, Header, Hero, Main],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bollicao');
}
