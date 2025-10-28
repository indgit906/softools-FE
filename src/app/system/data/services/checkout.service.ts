import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private details: any;

  setDetails(data: any) {
    this.details = data;
  }

  getDetails() {
    return this.details;
  }
}
