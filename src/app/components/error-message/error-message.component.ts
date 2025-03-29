import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ErrorService } from '../../services/error.service';
import { Subject, takeUntil } from 'rxjs';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-error-message',
  imports: [
    NgClass
  ],
  templateUrl: './error-message.component.html',
})
export class ErrorMessageComponent implements OnInit, OnDestroy {
  title = 'Error'
  message = ''
  isError = false;
  private destroy$$ = new Subject();
  private hideErrorTimeout: ReturnType<typeof setTimeout> | null = null;
  private hideMessageTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(private messageService: ErrorService) {
  }

  ngOnInit() {
    this.messageService.message$.pipe(
      takeUntil(this.destroy$$)
    ).subscribe((message) => {
      this.message = message;
      this.isError = true;

      this.clearTimeouts()

      this.hideErrorTimeout = setTimeout(() => this.isError = false, 3000);
      this.hideMessageTimeout = setTimeout(() => this.message = '', 5000);
    })
  }

  clearTimeouts() {
    if (this.hideErrorTimeout) {
      clearTimeout(this.hideErrorTimeout);
      this.hideErrorTimeout = null;
    }
    if (this.hideMessageTimeout) {
      clearTimeout(this.hideMessageTimeout);
      this.hideMessageTimeout = null;
    }

  }

  closeError() {
    this.clearTimeouts();

    this.isError = false;
    this.hideMessageTimeout = setTimeout(() => {
      if(!this.isError) this.message = ''
    }, 2000)
  }

  ngOnDestroy() {
    this.destroy$$.next(null);
    this.destroy$$.complete();
    this.clearTimeouts()
  }
}
