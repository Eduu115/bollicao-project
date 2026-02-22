import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CartOffcanvasService {
    private offcanvasOpenSubject = new Subject<boolean>();

    offcanvasOpen$ = this.offcanvasOpenSubject.asObservable();

    constructor() { }

    open() {
        this.offcanvasOpenSubject.next(true);
    }

    close() {
        this.offcanvasOpenSubject.next(false);
    }

    toggle() {
    }
}