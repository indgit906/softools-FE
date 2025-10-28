import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Product {
  title: string;
  productId: number;
  categoryId: number;
  quantity: number;
  oldPriceStr: string;
  priceStr: string;
  imageUrl: string;
  discount: number;
  productLink: string;
  numericPrice: number;
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private _baseUrl = environment.API;
  http = inject(HttpClient);
  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this._baseUrl}/products`);
  }
  getLatestProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this._baseUrl}/products`);
  }
}
