import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CartOffcanvasService {
    private offcanvasOpenSubject = new Subject<boolean>();

    // Observable for components to subscribe to
    offcanvasOpen$ = this.offcanvasOpenSubject.asObservable();

    constructor() { }

    open() {
        this.offcanvasOpenSubject.next(true);
    }

    close() {
        this.offcanvasOpenSubject.next(false);
    }

    toggle() {
        // This requires keeping track of state, but simpler for now to explicitly open/close
    }
}
