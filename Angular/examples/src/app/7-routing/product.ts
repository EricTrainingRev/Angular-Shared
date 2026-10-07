// A small catalog shared by the Products list and the product detail page so
// that every id in the list resolves to a real product on the detail route.

export interface Product {
  id: number;
  name: string;
  price: number;
}

export const PRODUCTS: Product[] = [
  { id: 1, name: 'Wireless Keyboard', price: 89 },
  { id: 2, name: '4K Monitor', price: 349 },
  { id: 3, name: 'USB-C Dock', price: 129 },
];
