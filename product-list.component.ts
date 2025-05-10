import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

// Define the Product interface outside the class
interface Product {
  product_name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  savedCards: any[] = [];
  activeTab: string = 'explore';  // Default active tab


  wishlist: Product[] = []; // Use the Product type for wishlist

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.getProducts();
    this.loadWishlist();
  }

  // Fetch products from the service
  getProducts(): void {
    this.productService.getProducts().subscribe(
      (res: any) => {
        this.products = res.data || [];
      },
      (err: any) => {
        console.error('Error fetching products:', err);
      }
    );
  }

  // Load the wishlist from localStorage
  loadWishlist(): void {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      this.wishlist = JSON.parse(storedWishlist);
    }
  }

   switchTab(tab: string) {
    this.activeTab = tab;
  }

  // Method to check if product is in saved cards
  isSavedToCard(product: any): boolean {
    return this.savedCards.some(p => p.id === product.id);
  }

  saveToCard(product: any) {
    if (!this.savedCards.find(p => p.id === product.id)) {
      this.savedCards.push(product);
      alert(`✔️ "${product.product_name}" has been saved to your cards.`);
    }
  }


  // Check if the product is in the wishlist
  isInWishlist(product: Product): boolean {
    return this.wishlist.some(item => item.product_name === product.product_name);
  }

  // Add product to wishlist
  addToWishlist(product: Product): void {
    const index = this.wishlist.findIndex(item => item.product_name === product.product_name);
    if (index === -1) { // Avoid adding duplicates
      this.wishlist.push(product);
      localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    }
  }

  // Remove product from wishlist
  removeFromWishlist(product: Product): void {
    this.wishlist = this.wishlist.filter((item) => item.product_name !== product.product_name);
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
  }

  // Get the total number of products in the wishlist
  getWishlistCount(): number {
    return this.wishlist.length;
  }
}
