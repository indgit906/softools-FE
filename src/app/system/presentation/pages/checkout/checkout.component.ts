import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormControl,
} from '@angular/forms';
import { CartService } from '../../../data/services/cart.service';
import { Product } from '../../../data/services/product.service';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { CheckoutService } from '../../../data/services/checkout.service';
@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  newForm: any;
  http = inject(HttpClient);
  cartService = inject(CartService);
  cartItems: Product[] = [];
  data: any[] = [];
  details: any;
  router = inject(Router);
  _baseUrl = environment.API;
  checkoutService = inject(CheckoutService);

  goToFinal() {
    if (this.newForm.valid) {
      this.checkoutService.setDetails(this.details);
      this.router.navigateByUrl('app/transfer');
    }
  }

  url = `${this._baseUrl}/images/qrcode`;

  ngOnInit(): void {
    this.checkoutItems();
  }
  constructor(private fb: FormBuilder) {
    this.checkoutItems();
    console.log(this.details);
    this.newForm = this.fb.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(\+91[\-\s]?)?[6-9][0-9]{9}$/),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
    this.details = {
      firstName: this.newForm.get('firstName')?.value,
      lastName: this.newForm.get('lastName')?.value,
      phone: this.newForm.get('phone')?.value,
      email: this.newForm.get('email')?.value,
      orderDetails: this.cartItems.map((item) => ({
        productId: item.productId,
        name: item.title,
        quantity: item.quantity,
        price: item.numericPrice,
      })),
    };
  }
  onSubmit() {
    if (this.newForm.invalid) {
      console.log('form is invalid');
      this.newForm.markAllAsTouched();
    } else {
      console.log(this.newForm.value);
    }
  }
  checkoutItems() {
    this.cartService.getItems().subscribe((items) => {
      this.cartItems = items;
    });
  }
  placeOrder() {
    //debugger;
    this.http
      .post<any[]>(`${this._baseUrl}/orders`, this.details)
      .subscribe((res) => {
        //debugger;
        this.data = res;
        console.log(this.data);
      });
    this.data = this.cartItems;
    this.cartService.clearCart();
    this.router.navigateByUrl('app/on-way');
  }
}
