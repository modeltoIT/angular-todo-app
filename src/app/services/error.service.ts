import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private message$$ = new Subject<string>();

  message$ = this.message$$.asObservable();

  showMessage(text: string) {
    this.message$$.next(text);
  }
}
