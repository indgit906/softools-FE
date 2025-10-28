import { Component, inject } from '@angular/core';
import { ShopService } from '../../../data/services/shop.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-description',
  imports: [],
  templateUrl: './description.component.html',
  styleUrl: './description.component.scss',
})
export class DescriptionComponent {
  constructor(private router: Router) {
    this.setData();
  }
  shopService = inject(ShopService);
  details: any;
  setData() {
    this.shopService.description(this.shopService.details).subscribe({
      next: (data: any) => {
        // debugger;
        this.details = data;
        // this.details.description.replace(/\n/g, '<br>');
        console.log(data);
        console.log(data.description);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  addToCart() {
    //debugger;
    this.router.navigateByUrl('app/shop');
  }
}
