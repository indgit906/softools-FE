import { Component, inject, OnInit } from '@angular/core';
import {
  Product,
  ProductService,
} from '../../../data/services/product.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-featured-products',
  imports: [RouterLink],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss',
})
export class FeaturedProductsComponent implements OnInit {
  ngOnInit(): void {
    this.getFeaturedProducts();
  }
  FeaturedProducts: Product[] = [];
  productservice = inject(ProductService);
  getFeaturedProducts(): Product[] {
    this.productservice.getFeaturedProducts().subscribe((data) => {
      const seen = new Set();
      const uniqueProducts = [];
      for (const product of data) {
        if (!seen.has(product.productLink)) {
          seen.add(product.productLink);
          uniqueProducts.push(product);
        }
      }
      this.FeaturedProducts = uniqueProducts;
    });
    return this.FeaturedProducts;
  }
}
