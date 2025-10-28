import { Component, inject } from '@angular/core';
import { Product } from '../../../data/services/product.service';
import { CartService } from '../../../data/services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cartItems: Product[] = [];
  cartService = inject(CartService);
  constructor() {
    this.getItems();
  }
  getItems() {
    this.cartService.getItems().subscribe((items) => {
      this.cartItems = items;
    });
  }
}
