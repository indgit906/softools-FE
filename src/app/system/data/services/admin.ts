import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  isDelete: boolean = true;
  apiUrl = environment.API;
  http = inject(HttpClient);
  data: any;
  token = localStorage.getItem('token');
  header = {
    headers: { Authorization: `Bearer ${this.token}` },
  };

  getProducts() {
    return this.http.get<any[]>(`${this.apiUrl}/products`);
  }
  setData(data: any) {
    this.data = data;
  }
  getData() {
    return this.data;
  }
  addProducts(data: any) {
    return this.http.post(`${this.apiUrl}/products/add`, data, this.header);
  }

  addDesc(data: any) {
    return this.http.post(
      `${this.apiUrl}/products/add/description`,
      data,
      this.header
    );
  }

  showDesc(id: number) {
    return this.http.get(
      `${this.apiUrl}/products/getdescription/${id}`,
      this.header
    );
  }

  addNewProducts(newProduct: any) {
    return this.http.post(
      `${this.apiUrl}/products/add`,
      newProduct,
      this.header
    );
  }

  addImage(image: any) {
    return this.http.post(
      `${this.apiUrl}/images/products/upload`,
      image,
      this.header
    );
  }
  //   onDelete(id: number) {
  //     const isDelete = confirm('Are you sure you want to delete');
  //     if (this.isDelete) {
  //       this.http
  //         .delete<any>(`${this.apiUrl}/products/add` + id)
  //         .subscribe((res: any) => {
  //           //debugger;
  //           if (res.result) {
  //             alert('Product deleted successfully.');
  //             this.getProducts();
  //           } else {
  //             alert(res.message);
  //           }
  //         });
  //     }
  //   }
}
