import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: any[] = [];
  private http = inject(HttpClient);
  private cartSubject = new BehaviorSubject<Product[]>(this.items);

  constructor() {}

  // Observable for components to subscribe to
  getItems() {
    return this.cartSubject.asObservable();
  }

  // Add a product (or increase quantity if exists)
  addToCart(item: Product) {
    const existingItem = this.items.find((p) => p.productId === item.productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({ ...item, quantity: 1 });
    }
    this.cartSubject.next(this.items);
  }

  // Increment quantity by index
  incrementQuantity(index: number) {
    if (index >= 0 && index < this.items.length) {
      this.items[index].quantity += 1;
      this.cartSubject.next(this.items);
    }
  }

  // Decrement quantity or remove item
  decrementQuantity(index: number) {
    if (index >= 0 && index < this.items.length) {
      const item = this.items[index];
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        this.removeItem(index);
        return;
      }
      this.cartSubject.next(this.items);
    }
  }

  // Remove item by index
  removeItem(index: number) {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
      this.cartSubject.next(this.items);
    }
  }

  // Clear entire cart
  clearCart() {
    this.items = [];
    this.cartSubject.next(this.items);
  }

  // Calculate subtotal
  getSubtotal(): number {
    return this.items.reduce((sum, item) => {
      const numericPrice = Number(
        item.priceStr?.replace(/[^\d.]/g, '') || item.numericPrice || 0
      );
      return sum + numericPrice * item.quantity;
    }, 0);
  }
}
