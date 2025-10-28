import { Component, inject } from '@angular/core';
import { LatestProductsComponent } from '../../sections/latest-products/latest-products.component';
import { FeaturedProductsComponent } from '../../sections/featured-products/featured-products.component';
import { ContactUsComponent } from '../contact-us/contact-us.component';
import { ActivatedRoute } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    LatestProductsComponent,
    FeaturedProductsComponent,
    ContactUsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private route = inject(ActivatedRoute);
  private scroller = inject(ViewportScroller);

  ngOnInit() {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        setTimeout(() => {
          this.scroller.scrollToAnchor(fragment);
        }, 1100); // Wait for DOM to render
      }
    });
  }
}
