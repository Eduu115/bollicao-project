import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfileOffcanvasService } from '../../../services/profile-offcanvas.service';
import { SessionService, SessionUser } from '../../../services/session.service';

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

    session: SessionUser | null = null;

    constructor(
        private profileOffcanvasService: ProfileOffcanvasService,
        private sessionService: SessionService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;

        this.sub = this.profileOffcanvasService.offcanvasOpen$.subscribe((open: boolean) => {
            this.session = this.sessionService.getSession();
            if (open) setTimeout(() => this.open(), 50);
            else this.close();
        });
    }

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId) || !this.offcanvasElement) return;
        const bs = this.getBootstrap();
        if (bs) {
            this.offcanvasInstance = new bs.Offcanvas(this.offcanvasElement.nativeElement);
            this.offcanvasElement.nativeElement.addEventListener('hidden.bs.offcanvas', () => {
                this.profileOffcanvasService.close();
            });
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
        this.offcanvasInstance?.show();
    }

    close(): void {
        this.offcanvasInstance?.hide();
    }

    logout(): void {
        this.sessionService.clearSession();
        this.profileOffcanvasService.close();
        this.router.navigateByUrl('/');
    }

    get userName(): string {
        return this.session?.nombre ?? 'Usuario';
    }

    get userEmail(): string {
        return this.session?.email ?? '';
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
