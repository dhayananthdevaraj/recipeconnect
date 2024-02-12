import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';;
import { ChangeDetectorRef } from '@angular/core';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-usertask',
  templateUrl: './usertask.component.html',
  styleUrls: ['./usertask.component.css']
})
export class UsertaskComponent implements OnInit {

  showDeletePopup: boolean = false;
  showLogoutPopup: boolean = false;
  productToBeDelete: any = null;
  showPopup: boolean = false;
  selectedRecipe: any = null;
  products: any[] = [];
  searchTerm: string = '';
  sortValue: number = 1;

  constructor(private router: Router, private recipeService: RecipeService) {}

  ngOnInit(): void {
    localStorage.setItem('editId', '');
    this.fun();
  }

  async fun(): Promise<void> {
    try {
      let userId;
      const userData = localStorage.getItem('userData');
      if (userData) {
        userId = JSON.parse(userData).userId;
      }
      let token = localStorage.getItem('token');
      if (!token) {
        token = '';
      }



      const productResponse: any = await this.recipeService.getUserRecipes(userId, this.searchTerm, this.sortValue, token).toPromise();
      console.log('productResponse', productResponse);
      if (productResponse.status === 200) {
        this.products = productResponse.body;
      }
    } catch (error) {
      // Handle error or navigate to an error page
      this.router.navigate(['/error']);
    }
  }

  async deleteFunction(): Promise<void> {
    const productId = this.productToBeDelete;
    let token = localStorage.getItem('token');
    if (!token) {
      token = '';
    }

    try {
      const deleteResponse: any = await this.recipeService.deleteRecipe(productId, token).toPromise();
      console.log('deleteResponse', deleteResponse);
      if (deleteResponse.status === 200) {
        this.fun();
      }

      this.showDeletePopup = false;
    } catch (error) {
      console.log('error', error);
    }
  }

  openPopup(recipe: any): void {
    this.selectedRecipe = recipe;
    this.showPopup = true;
  }

  closePopup(): void {
    this.selectedRecipe = null;
    this.showPopup = false;
  }

  setShowDeletePopup(value: boolean): void {
    this.showDeletePopup = value;
  }

  setShowLogoutPopup(value: boolean): void {
    this.showLogoutPopup = value;
  }

  navigateToCreateProduct(): void {
    this.router.navigate(['/createtask']);
  }

  navigateToEditProduct(recipeId: any): void {
    localStorage.setItem('editId', recipeId);
    this.router.navigate(['/createtask']);
  }

  handleDeleteClick(id: any): void {
    this.productToBeDelete = id;
    this.showDeletePopup = true;
  }




  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
