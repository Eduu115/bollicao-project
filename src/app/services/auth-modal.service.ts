import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {
  private loginModalOpen = new BehaviorSubject<boolean>(false);
  private registerModalOpen = new BehaviorSubject<boolean>(false);
  private returnUrl = new BehaviorSubject<string | null>(null);

  loginModal$ = this.loginModalOpen.asObservable();
  registerModal$ = this.registerModalOpen.asObservable();
  returnUrl$ = this.returnUrl.asObservable();

  openLoginModal(returnUrl?: string | null): void {
    if (returnUrl !== undefined) {
      this.returnUrl.next(returnUrl);
    }
    this.loginModalOpen.next(true);
  }

  closeLoginModal(): void {
    this.loginModalOpen.next(false);
    this.returnUrl.next(null);
  }

  openRegisterModal(): void {
    this.registerModalOpen.next(true);
  }

  closeRegisterModal(): void {
    this.registerModalOpen.next(false);
  }

  switchToRegister(): void {
    this.closeLoginModal();
    setTimeout(() => this.openRegisterModal(), 150);
  }

  switchToLogin(): void {
    this.closeRegisterModal();
    setTimeout(() => this.openLoginModal(), 150);
  }
}
