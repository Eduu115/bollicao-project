import { Component, HostListener  } from '@angular/core';
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
  onScroll() { // esto es el umbral de 
    this.scrolled = window.scrollY > 40;
  }

}

