import { Component, inject, OnInit } from '@angular/core';
import {
  Product,
  ProductService,
} from '../../../data/services/product.service';
// import { ShopService } from '../../../data/services/shop.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-latest-products',
  imports: [RouterLink],
  templateUrl: './latest-products.component.html',
  styleUrl: './latest-products.component.scss',
})
export class LatestProductsComponent implements OnInit {
  // shopService = inject(ShopService);
  // details: any;
  ngOnInit(): void {
    this.getLatestProducts();
  }
  LatestProducts: Product[] = [];
  productservice = inject(ProductService);
  getLatestProducts(): Product[] {
    this.productservice.getLatestProducts().subscribe((data) => {
      const seen = new Set();
      const distinctProducts = [];
      for (const product of data) {
        if (!seen.has(product.productLink)) {
          seen.add(product.productLink);
          distinctProducts.push(product);
        }
      }
      this.LatestProducts = distinctProducts;
    });
    return this.LatestProducts;
  }

  // setData() {
  //   this.shopService.description(this.shopService.details).subscribe({
  //     next: (data) => {
  //       this.details = data;
  //       console.log(data);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }
}
