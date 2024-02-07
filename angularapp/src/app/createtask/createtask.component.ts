import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-createtask',
  templateUrl: './createtask.component.html',
  styleUrls: ['./createtask.component.css']
})
export class CreatetaskComponent implements OnInit {
  productData: any = {
    recipeName: '',
    description: '',
    ingredients: '',
    category: '',
    price: 0,
    photo: null,
    servingSize: 0
  };

  errors: any = {
    recipeName: '',
    description: '',
    ingredients: '',
    category: '',
    price: '',
    photo: '',
    servingSize: ''
  };

  recipeCategories: string[] = ['Main Course', 'Appetizer', 'Dessert', 'Beverage', 'Snack', 'Breakfast', 'Lunch', 'Dinner', 'Soup', 'Salad', 'Side Dish', 'Sea Dish', 'Other'];

  constructor(private router: Router, private recipeService: RecipeService) { }

  ngOnInit(): void {
    console.log("localStorage.getItem", localStorage.getItem("editId"));
    let a = localStorage.getItem("editId");
    if (a !== "") {
      this.editfun();
    }
  }

  async editfun(): Promise<void> {
    let token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    let editID = localStorage.getItem("editId");
    if (!editID) {
      editID = '';
    }

    try {
      const response: any = await this.recipeService.getRecipe(editID, token).toPromise();

      console.log("response in id", response);
      this.productData = response;
    } catch (error) {
      this.router.navigate(['/error']);
    }
  }

  handleInputChange(event: any): void {
    this.productData[event.target.name] = event.target.value;
    this.errors[event.target.name] = '';
  }

  handleFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.convertFileToBase64(file);
    }
  }

  convertFileToBase64(file: any): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.productData.photo = reader.result;
    };
    reader.readAsDataURL(file);
  }

  handleCreateProduct(): void {
    // Validate the form before submitting
    this.validateForm();

    if (Object.keys(this.errors).length > 0) {
      return;
    }

    // Rest of the code remains the same
    // ...
    let userData = localStorage.getItem("userData");
    if (!userData) {
      userData = '';
    }
    this.productData.userId = JSON.parse(userData).userId;

    console.log("productData", this.productData);

    try {
      let a = localStorage.getItem("editId");
      if (a === "") {
        this.createRecipe();
      } else {
        this.updateRecipe();
      }
    } catch (error) {
      this.router.navigate(['/error']);
    }
  }

  validateForm(): void {
    // Clear previous errors
    this.errors = {};

    if (this.productData.recipeName === "") {
      this.errors.recipeName = "Recipe name is required";
    }

    if (this.productData.description === "") {
      this.errors.description = "Description is required";
    }

    if (this.productData.ingredients === "") {
      this.errors.ingredients = "Ingredients are required";
    }

    if (this.productData.category === "") {
      this.errors.category = "Category is required";
    }

    if (!this.productData.price) {
      this.errors.price = "Price is required";
    } else if (this.productData.price < 0) {
      this.errors.price = "Price cannot be negative";
    }

    if (!this.productData.photo) {
      this.errors.photo = "Photo is required";
    }

    if (!this.productData.servingSize) {
      this.errors.servingSize = "Serving size is required";
    } else if (this.productData.servingSize < 1) {
      this.errors.servingSize = "Serving size must be at least 1";
    }
  }


  createRecipe(): void {
    let token = localStorage.getItem("token");
    if (!token) {
      token = '';
    }
    this.recipeService.createRecipe(this.productData, token).subscribe(
      (createProductRespose: any) => {
        if (createProductRespose.status === 200) {
          this.router.navigate(['/usertask']);
        }
      },
      (error: any) => {
        console.log('error', error);
        this.router.navigate(['/error']);
      }
    );
  }

  updateRecipe(): void {
    let token = localStorage.getItem("token");
    if (!token) {
      token = '';
    }

    let editId = localStorage.getItem("editId");
    if (!editId) {
      editId = '';
    }
    this.recipeService.updateRecipe(editId, this.productData, token).subscribe(
      (updateProduct: any) => {
        console
        if (updateProduct.status === 200) {
          this.router.navigate(['/usertask']);
        }
      },
      (error: any) => {
        console.log('error', error);
        this.router.navigate(['/error']);
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/usertask']);
  }

  getEditId(): string | null {
    return localStorage.getItem("editId");
  }
}
