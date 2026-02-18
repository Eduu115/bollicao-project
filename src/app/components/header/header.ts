import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})

export class Header {
  scrolled = false;

  @HostListener('window:scroll')
  onScroll() {
    // Se activa cuando el navbar llega al top (hero = 100vh, navbar = 86px)
    this.scrolled = window.scrollY > (window.innerHeight - 86);
  }
}
