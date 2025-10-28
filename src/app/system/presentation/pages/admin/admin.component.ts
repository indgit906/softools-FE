import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../../data/services/cart.service';
import {
  NgxEditorComponent,
  NgxEditorMenuComponent,
  Editor,
  Toolbar,
  schema,
  toHTML,
} from 'ngx-editor';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../data/services/admin';
import { AuthService } from '../../../data/services/auth.service';
import { Router } from '@angular/router';
import { ShopService } from '../../../data/services/shop.service';

@Component({
  selector: 'app-admin',
  imports: [
    CommonModule,
    FormsModule,
    NgxEditorComponent,
    NgxEditorMenuComponent,
  ],
  providers: [AdminService],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit, OnDestroy {
  constructor() {
    this.getData();
    if (localStorage.getItem('token') == null) {
      this.router.navigateByUrl('/app/login');
    } else {
      this.getOrders();
    }
    this.shopService.getCategory().subscribe((data: any) => {
      this.categories = data;
    });
  }
  html = '';
  editor: Editor = new Editor();
  data: any[] = [];
  order: any;
  editorContent: string = '';
  imageName: string = '';
  product: any;
  categories: any[] = [];
  filteredOrders: any[] = [];
  paginated: any[] = [];
  cartItems: any[] = [];
  Orders = false;
  Products = false;
  adminService = inject(AdminService);
  shopService = inject(ShopService);
  router = inject(Router);

  currentPage: number = 1;
  itemsPerPage = 10;
  totalPages: number = 0;
  totalPagesArray: number[] = [];
  authService = inject(AuthService);
  expandedOrderId: number | null = null;

  filters = {
    name: '',
    email: '',
    status: '',
  };

  cartService = inject(CartService);
  http = inject(HttpClient);
  apiUrl = environment.API;
  // Get orders. Get products which are in cart
  getOrders() {
    // debugger;
    const header = this.adminService.header;
    this.http.get<any[]>(`${this.apiUrl}/orders`, header).subscribe((res) => {
      this.data = res;
      this.applyFilters(); // Set up filtered + paginated
    });
  }

  getItems() {
    const items = this.cartService.getItems();
    if (Array.isArray(items)) {
      this.cartItems = items;
    }
  }

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  orderStatuses: string[] = [];
  currentView: 'orders' | 'edit' | 'products' = 'orders';
  ngOnInit(): void {
    // this.fetchStatuses();
    this.authService.view$.subscribe((view) => {
      this.currentView = view;
    });
    this.editor = new Editor();
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }
  //Fetching and updating status in different apis in different dbs
  fetchStatuses() {
    const header = this.adminService.header;
    this.http
      .get<string[]>(`${this.apiUrl}/orders`, header)
      .subscribe((res) => {
        this.orderStatuses = res;
      });
  }

  updateOrderStatus(orderId: number, newStatus: string) {
    //debugger;
    this.http
      .post(
        `${this.apiUrl}/orders/complete`,
        {
          orderId,
          orderStatus: newStatus,
        },
        this.adminService.header
      ) // it is a just id and status
      .subscribe({
        next: () => {
          const order = this.data.find((o) => o.orderId === orderId);

          order.orderStatus = newStatus;

          const paginatedOrder = this.paginated.find(
            (o) => o.orderId === orderId
          );
          if (paginatedOrder) {
            paginatedOrder.orderStatus = newStatus;
          }
        },
        error: (err) => {
          console.error('Failed to update status', err);
        },
      });
  }
  // Apply filters and pagination
  applyFilters() {
    this.filteredOrders = this.data.filter((order) => {
      return (
        (!this.filters.name ||
          order.name.toLowerCase().includes(this.filters.name.toLowerCase())) &&
        (!this.filters.email ||
          order.email
            .toLowerCase()
            .includes(this.filters.email.toLowerCase())) &&
        (!this.filters.status || order.status === this.filters.status)
      );
    });
    this.setupPagination();
  }

  setupPagination() {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    this.totalPagesArray = Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );
    this.changePage(1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      const start = (page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      this.paginated = this.filteredOrders.slice(start, end);
    }
  }

  toggleExpand(orderId: number) {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }
  // updateOrderStatus(orderId: number, newStatus: string) {
  //   const payload = {
  //     orderId: orderId,
  //     status: newStatus,
  //   };

  //   this.http.post(`${this.apiUrl}/orders/update-status`, payload).subscribe({
  //     next: (res) => {
  //       console.log('Status updated:', res);
  //       // Optional: Refresh data or show toast
  //       this.getOrders(); // Reload data if needed
  //     },
  //     error: (err) => {
  //       console.error('Failed to update status:', err);
  //     },
  //   });
  // }

  //To toggle between approving orders and editing products
  changeOrders() {
    this.Orders = !this.Orders;
  }
  changeProducts() {
    this.Products = !this.Products;
  }

  // Add more products as needed from admin service

  products: any[] = [];
  isEdit = false;
  productObj = {
    title: '',
    categoryId: 0,
    productLink: '',
    oldPriceStr: '', // ✅ string (from user input)
    priceStr: '', // ✅ string (if needed separately)
    description: '',
    discount: '', // ✅ string
    numericPrice: 0, // ✅ number (calculated value)
    imageUrl: '',
  };

  getData() {
    this.adminService.getProducts().subscribe((res) => {
      this.products = res;
    });
  }

  navigateTo(view: 'orders' | 'products' | 'edit') {
    this.authService.switchView(view);
  }
  description: any;

  calculateNewPrice(): void {
    const oldPrice = parseFloat(this.productObj.oldPriceStr);
    const discount = parseFloat(this.productObj.discount);

    if (!isNaN(oldPrice) && !isNaN(discount)) {
      const discountedPrice = oldPrice - (oldPrice * discount) / 100;
      this.productObj.numericPrice = parseFloat(discountedPrice.toFixed(2));
    } else {
      this.productObj.numericPrice = 0;
    }
  }

  onEdit(data: any) {
    this.adminService.showDesc(data.productId).subscribe((res: any) => {
      this.productObj.description = res.description;
      console.log(this.productObj.description);
    });
    this.product = this.products.find((p) => p.productId === data.productId);
    this.isEdit = true;
    this.productObj = data;
    console.log('Prddddddddd', this.productObj);
    this.navigateTo('edit');
  }
  onDelete(id: number) {}
  jsonPayload: any;

  onUpdate() {
    // debugger;
    this.jsonPayload = this.productObj.description;
    // const htmlContent = toHTML(this.jsonPayload, schema);
    // if (this.jsonPayload == htmlContent) {
    //   this.description = this.jsonPayload;
    // } else {
    //   this.description = htmlContent;
    // }
    const data = {
      productId: this.product.productId,
      description: this.jsonPayload,
    };
    console.log(data);
    this.adminService.addDesc(data).subscribe((res) => {
      if (res != null || undefined) {
        // debugger;
        this.isEdit = false;
        this.getData();
      } else {
        console.log('Enter a valid description');
      }
    });
  }

  image: File | null = null;
  onImageChange(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.image = input.files[0];
      console.log('image that has been uploaded', this.image);
    }
    const formData = new FormData();
    formData.append('image', this.image!);

    this.adminService.addImage(formData).subscribe({
      next: (res: any) => {
        // debugger;
        // const imageName = res;
        this.imageName = res.imageName;
      },
      error: (err) => {
        console.log('The image could not be uploaded', err);
      },
    });
  }
  onSave() {
    // debugger;
    const { imageUrl, productLink, numericPrice, priceStr, ...rest } =
      this.productObj;
    const data = {
      imageUrl: this.imageName,
      priceStr: String(numericPrice),
      numericPrice: numericPrice,
      ...rest,
    };
    console.log('This is the product data', data);
    this.adminService.addNewProducts(data).subscribe((res) => {
      // debugger;
      if (res != null || undefined) {
        // debugger;
        console.log('The product has been uploaded successfully', res);
        this.getData();
      } else {
        console.log('Enter all the fields');
      }
    });

    this.onReset();
  }
  onReset() {
    this.productObj = {
      title: '',
      categoryId: 0,
      productLink: '',
      oldPriceStr: '',
      priceStr: '',
      description: '',
      discount: '',
      numericPrice: 0,
      imageUrl: '',
    };
  }
  get discountedPrice(): number {
    const oldPrice = parseFloat(this.productObj.oldPriceStr) || 0;
    const discount = parseFloat(this.productObj.discount) || 0;
    const discounted = oldPrice - (oldPrice * discount) / 100;
    return parseFloat(discounted.toFixed(2));
  }
}
