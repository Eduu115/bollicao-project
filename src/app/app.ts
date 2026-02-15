import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Main } from './components/main/main';
import { Footer } from './components/footer/footer';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header,Footer, Main],
  templateUrl:'./app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bollicao');
}
