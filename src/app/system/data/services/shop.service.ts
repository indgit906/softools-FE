import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product } from './product.service';
import { Router } from '@angular/router';

// export interface Product {
//   title: string;
//   priceStr: string;
//   imageUrl: string;
//   imageAlt: string;
//   discount: number;
//   productLink: string;
//   oldPriceStr: string;
//   numericPrice: number;
// }

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  details: any;
  getData(data: any) {
    this.details = data;
  }
  setData() {
    return this.details;
  }
  private _baseUrl = environment.API;
  http = inject(HttpClient);
  router = inject(Router);
  getShopProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this._baseUrl}/products`);
  }
  description(id: number): Observable<Product> {
    return this.http.get<Product>(`${this._baseUrl}/products/itm/${id}`);
  }
  getCategory(): any {
    return this.http.get<any>(`${this._baseUrl}/prodcategory`);
  }
  productsFilter(data: any): Observable<any> {
    return this.http.post<any>(`${this._baseUrl}/products/filter`, data);
  }
}
