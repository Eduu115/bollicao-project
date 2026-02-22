import { Component, signal, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { LoginModal } from './components/modals/login-modal/login-modal';
import { RegisterModal } from './components/modals/register-modal/register-modal';
import { ProfileOffcanvas } from './components/modals/profile-offcanvas/profile-offcanvas';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header, LoginModal, RegisterModal, ProfileOffcanvas],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('bollicao');
  protected readonly isBrowser = signal(false);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser.set(isPlatformBrowser(this.platformId));
  }
}
