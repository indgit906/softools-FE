import { Component, inject } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { CartService } from '../../../data/services/cart.service';
import { CheckoutService } from '../../../data/services/checkout.service';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transfer',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss',
})
export class TransferComponent {
  _baseUrl = environment.API;
  cartItems: any;
  details: any;
  data: any[] = [];
  cartService = inject(CartService);
  checkoutService = inject(CheckoutService);
  url = `${this._baseUrl}/images/qrcode`;
  http = inject(HttpClient);
  constructor(private readonly router: Router) {
    this.getItems();
  }
  transaction: string = '';
  getItems() {
    this.details = this.checkoutService.getDetails();
    this.cartService.getItems().subscribe((items) => {
      this.data = items;
    });
  }
  placeOrder() {
    //debugger;
    this.http
      .post<any[]>(`${this._baseUrl}/orders/${this.transaction}`, this.details)
      .subscribe((res) => {
        this.data = res;
        //debugger;
        console.log(this.transaction);
        console.log(this.data);
      });
    this.data = this.cartItems;
    this.cartService.clearCart();
    this.router.navigateByUrl('app/cart');
  }
}
