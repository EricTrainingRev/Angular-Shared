import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PRODUCTS } from '../product';

/**
 * A child route that reads a URL parameter. The route is defined as
 * /routing/product/:id, so the value after the last "/" is the id. This page
 * pulls that value out of the ActivatedRoute snapshot and finds the matching
 * product from the shared catalog.
 */
@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  private readonly route = inject(ActivatedRoute);

  // The :id value from the URL, e.g. /routing/product/2 yields '2'. Read once
  // from the snapshot because it never changes for a given navigation.
  protected readonly id = this.route.snapshot.paramMap.get('id');

  // The product whose id matches the URL param, or undefined if the id is bad.
  // Number() converts the string param to a number to compare with product ids.
  protected readonly product = PRODUCTS.find((p) => p.id === Number(this.id));
}
