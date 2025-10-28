import { Component, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../../data/services/product.service';
import { ShopService } from '../../../data/services/shop.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../data/services/cart.service';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent implements OnInit {
  allProducts: Product[] = [];
  cartItems: any[] = [];
  total: number = 0;
  categories: any[] = [];
  searchText: string = '';
  selectedCategoryId: number = 0;
  priceRange: number = 0;
  shopService = inject(ShopService);
  cartService = inject(CartService);
  currentPage = signal(1);
  router = inject(Router);
  itemsPerPage = 10;
  ngOnInit(): void {
    this.shopService.getShopProducts().subscribe((data) => {
      if (data.length == 0 || data == null) {
        this.allProducts = [];
        alert('Products Not available');
      } else {
        this.allProducts = data;
      }
    });
    this.shopService.getCategory().subscribe({
      next: (data: any) => {
        this.categories = data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
    this.cartService.getItems().subscribe((items) => {
      this.cartItems = items;
    });
  }
  // get totalPages(): number {
  //   return Math.ceil(this.allProducts.length / this.itemsPerPage);
  // }
  // get filteredProducts(): Product[] {
  //   return this.allProducts.filter((product) => {
  //     const matchesSearch =
  //       this.searchText.trim() === '' ||
  //       product.title.toLowerCase().includes(this.searchText.toLowerCase());

  //     const matchesCategory =
  //       this.selectedCategoryId === 0 ||
  //       product.categoryId === this.selectedCategoryId;

  //     const matchesPrice =
  //       this.priceRange === 0 || product.numericPrice <= this.priceRange;

  //     return matchesSearch && matchesCategory && matchesPrice;
  //   });
  // }

  setCategory(id: number) {
    this.selectedCategoryId = id;
    this.currentPage.set(1);
  }

  // Page numbers array
  get totalPagesArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.allProducts.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.allProducts.length / this.itemsPerPage);
  }

  // get totalPages(): number {
  //   return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  // }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage.set(page);
    }
  }

  openCart(product: Product) {
    this.cartService.addToCart(product);
  }
  Checkout() {
    this.router.navigateByUrl('app/checkout');
  }
  description(id: number) {
    this.shopService.description(id).subscribe({
      next: (data) => {
        this.shopService.getData(id);
        this.router.navigateByUrl('app/description/' + id);
      },
    });
  }

  changeFilter(data: {
    searchText?: string;
    maxPrice?: number;
    minPrice?: number;
    categoryId?: number;
  }) {
    if (data.searchText !== undefined) this.searchText = data.searchText;
    if (data.minPrice !== undefined) this.priceRange = data.minPrice;
    if (data.maxPrice !== undefined) this.priceRange = data.maxPrice;
    if (data.categoryId !== undefined)
      this.selectedCategoryId = data.categoryId;

    const request = {
      searchText: this.searchText,
      maxPrice: this.priceRange,
      minPrice: 0,
      categoryId: this.selectedCategoryId,
    };

    this.shopService.productsFilter(request).subscribe({
      next: (data) => {
        this.allProducts = data;
        this.currentPage.set(1);
      },
      error: (err) => console.error(err),
    });
  }
}
