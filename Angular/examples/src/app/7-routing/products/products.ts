import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PRODUCTS } from '../product';

/**
 * A catalog list. Each product links to its own detail page by passing the
 * product id as a route parameter (:id), demonstrating parameterized routes.
 */
@Component({
  selector: 'app-products',
  imports: [RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  // The catalog, shared with the product detail page so every id resolves.
  // It is a plain constant array (never changes), so no signal is needed.
  protected readonly products = PRODUCTS;
}
