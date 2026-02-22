import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileOffcanvasService {
    private openSubject = new BehaviorSubject<boolean>(false);
    offcanvasOpen$ = this.openSubject.asObservable();

    open(): void {
        this.openSubject.next(true);
    }

    close(): void {
        this.openSubject.next(false);
    }

    toggle(): void {
        this.openSubject.next(!this.openSubject.value);
    }
}
