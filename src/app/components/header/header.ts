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
  onScroll() { // esto es el umbral del scroll, cuando el usuario baja mas de este numero de px el header cambia
    this.scrolled = window.scrollY > 350;
  }

}

