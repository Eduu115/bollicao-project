import { Component, OnInit, OnDestroy } from '@angular/core';
import { Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero implements OnInit, OnDestroy {
  private scrollListener: (() => void) | undefined;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() {
    this.scrollListener = this.renderer.listen('window', 'scroll', () => {
      this.handleScroll();
    });
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      this.scrollListener();
    }
  }

  private handleScroll() {
    const navbar = document.querySelector('.navbar-pasteleria') as HTMLElement;
    const header = document.querySelector('.header-blur') as HTMLElement;
    
    if (!navbar || !header) return;

    const scrollY = window.scrollY;
    const heroHeight = window.innerHeight;
    const headerHeight = header.getBoundingClientRect().height;
    
    // Fusionar cuando el navbar toca/se solapa con el header (posición de contacto)
    if (scrollY >= heroHeight - headerHeight) {
      if (navbar.style.display !== 'none') {
        this.moveNavItemsToHeader(navbar, header);
        navbar.style.display = 'none';
      }
    } else {
      // Restaurar el navbar si volvemos arriba
      if (navbar.style.display === 'none') {
        this.restoreNavItems(navbar, header);
        navbar.style.display = 'block';
      }
    }
  }

  private moveNavItemsToHeader(navbar: HTMLElement, header: HTMLElement) {
    const navContent = navbar.querySelector('.navbar-nav');
    if (navContent && !header.querySelector('.nav-items-container')) {
      const container = this.renderer.createElement('div');
      this.renderer.addClass(container, 'nav-items-container');
      this.renderer.addClass(container, 'navbar-expand-lg'); // Bootstrap aplica row al navbar-nav
      
      const clonedNav = navContent.cloneNode(true) as HTMLElement;
      this.renderer.addClass(clonedNav, 'd-flex');
      this.renderer.addClass(clonedNav, 'flex-row');
      this.renderer.setStyle(clonedNav, 'flexDirection', 'row');
      this.renderer.appendChild(container, clonedNav);
      
      // Insertar entre el logo y el carrito
      const headerContainer = header.querySelector('.container');
      const logo = header.querySelector('.navbar-brand');
      const carrito = header.querySelector('.carrito-circle');
      
      if (headerContainer && logo && carrito) {
        // Insertar después del logo pero antes del carrito
        this.renderer.insertBefore(headerContainer, container, carrito);
      }
    }
  }

  private restoreNavItems(navbar: HTMLElement, header: HTMLElement) {
    const container = header.querySelector('.nav-items-container');
    if (container) {
      const headerContainer = header.querySelector('.container');
      if (headerContainer) {
        this.renderer.removeChild(headerContainer, container);
      }
    }
  }
}
