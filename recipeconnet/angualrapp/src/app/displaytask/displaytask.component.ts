import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from '../../apiConfig';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-displaytask',
  templateUrl: './displaytask.component.html',
  styleUrls: ['./displaytask.component.css']
})
export class DisplaytaskComponent implements OnInit {
  recipes: any[] = [];
  selectedRecipe: any = null;
  showLogoutPopup: boolean = false;
  showPopup: boolean = false;
  searchTerm: string = '';
  sortValue: number = 1;

  constructor(private recipeService: RecipeService , public router : Router) {}

  ngOnInit(): void {
    this.fetchRentals();
  }

  async fetchRentals(): Promise<void> {
    try {
      const userResponse: any = await this.recipeService.getUsers().toPromise();
      console.log('userResponse', userResponse);
      const productResponse: any = await this.recipeService.getRecipes(this.searchTerm, this.sortValue).toPromise();
       console.log('productResponse', productResponse);
      const users: any = userResponse.body;
      const recipeData: any = productResponse.body;

      const recipeWithUserData = recipeData.map((recipe: any) => {
        const user = users.find((u: any) => u.userId === recipe.userId || u.userId === recipe.user_id);
        return {
          ...recipe,
          userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
          userEmail: user ? user.email : 'Unknown',
          userPhone: user ? user.mobileNumber : 'Unknown'
        };
      });

      this.recipes = recipeWithUserData;
    } catch (error) {
      // Handle error or navigate to an error page
      // this.router.navigate(['/error']);
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

  setShowLogoutPopup(): void {
    this.showLogoutPopup = true;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
}
}
