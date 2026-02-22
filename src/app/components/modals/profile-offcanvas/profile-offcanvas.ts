import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfileOffcanvasService } from '../../../services/profile-offcanvas.service';
import { UsersService } from '../../../services/users.service';

declare var bootstrap: any;

@Component({
    selector: 'app-profile-offcanvas',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './profile-offcanvas.html',
    styleUrl: './profile-offcanvas.css'
})
export class ProfileOffcanvas implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('profileOffcanvas') offcanvasElement!: ElementRef;
    private offcanvasInstance: any = null;
    private sub: Subscription = new Subscription();

    userEmail: string = '';

    constructor(
        private profileOffcanvasService: ProfileOffcanvasService,
        private usersService: UsersService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        this.sub = this.profileOffcanvasService.offcanvasOpen$.subscribe((open: boolean) => {
            const session = this.usersService.getCurrentSession();
            this.userEmail = session?.email ?? '';
            if (open) {
                setTimeout(() => this.open(), 50);
            } else {
                this.close();
            }
        });
    }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId) && this.offcanvasElement) {
            const bs = this.getBootstrap();
            if (bs) {
                this.offcanvasInstance = new bs.Offcanvas(this.offcanvasElement.nativeElement);
                this.offcanvasElement.nativeElement.addEventListener('hidden.bs.offcanvas', () => {
                    this.profileOffcanvasService.close();
                });
            }
        }
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    open(): void {
        if (!this.offcanvasInstance) {
            const bs = this.getBootstrap();
            if (bs && this.offcanvasElement) {
                this.offcanvasInstance = new bs.Offcanvas(this.offcanvasElement.nativeElement);
            }
        }
        if (this.offcanvasInstance) {
            this.offcanvasInstance.show();
        }
    }

    close(): void {
        if (this.offcanvasInstance) {
            this.offcanvasInstance.hide();
        }
    }

    logout(): void {
        this.usersService.clearSession();
        this.profileOffcanvasService.close();
        this.router.navigateByUrl('/');
    }

    get userName(): string {
        if (!this.userEmail) return 'Usuario';
        const base = this.userEmail.split('@')[0] ?? 'Usuario';
        return base.charAt(0).toUpperCase() + base.slice(1);
    }

    get userInitial(): string {
        return this.userName.charAt(0).toUpperCase();
    }

    private getBootstrap(): any {
        if (typeof window === 'undefined') return null;
        if ((window as any)['bootstrap']) return (window as any)['bootstrap'];
        if (typeof bootstrap !== 'undefined') return bootstrap;
        return null;
    }
}
