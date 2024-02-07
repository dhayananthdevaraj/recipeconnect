import { Injectable } from '@angular/core';
import { apiUrl } from '../../apiConfig';
import { Observable } from 'rxjs';
import { HttpClient , HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private http: HttpClient) { }

  getUserRecipes(userId: string, searchTerm: string, sortValue: number, token: string): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({ 'Authorization': token });
    const params = new HttpParams().set('searchTerm', searchTerm).set('sortValue', sortValue.toString());

    return this.http.get<any>(`${apiUrl}/api/recipe/user/${userId}`, { headers, params, observe: 'response' });
  }

  deleteRecipe(productId: string, token: string): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({ 'Authorization': token });

    return this.http.delete(`${apiUrl}/api/recipe/${productId}`, { headers , observe: 'response'});
  }

  getRecipe(id: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.get(`${apiUrl}/api/recipe/${id}`, { headers });
  }

  createRecipe(data: any, token: string): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.post<any>(`${apiUrl}/api/recipe`, data, { headers ,observe: 'response'});
  }

  updateRecipe(id: string, data: any, token: string): Observable<HttpResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this.http.put<any>(`${apiUrl}/api/recipe/${id}`, data, { headers , observe: 'response'});
  }

  getUsers(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${apiUrl}/api/users`, { headers , observe: 'response'});
  }

  getRecipes(searchTerm: string, sortValue: number): Observable<any> {
    const headers = this.getHeaders();
    const params = new HttpParams()
      .set('searchValue', searchTerm)
      .set('sortValue', sortValue.toString());

    return this.http.get(`${apiUrl}/api/recipe`, { headers, params , observe: 'response'});
  }

  // Add more methods for other API calls (create, update, delete) as needed

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: token });
  }


























  getTasksByUserId(searchTerm: string, sortValue: number, userId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `${token}` });
    return this.http.post<any>(
      `${apiUrl}/tasks/getTasksByUserId`,
      { searchValue: searchTerm, sortValue, userId },
      { headers, observe: 'response' }
    );
  }

  deleteTask(doctorId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({ 'Authorization': `${token}` });
    return this.http.delete<any>(
      `${apiUrl}/tasks/deleteTask/${doctorId}`,
      { headers, observe: 'response' }
    );
  }

  getTaskById(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${apiUrl}/tasks/getTaskById/${id}`, { headers: { Authorization: `${token}` } });
  }


  async getAllUsers(): Promise<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${apiUrl}/user/getAllUsers`, { headers: { Authorization: `${token}` } }).toPromise();
  }

  addTask(productData: any): Observable<any> {
    const token = localStorage.getItem('token');
    productData.userId = JSON.parse(localStorage.getItem('userData') || '{}').userId;
    return this.http.post<any>(`${apiUrl}/tasks/addTask`, productData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`
      }
    });
  }


  updateTask(editId: string, productData: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put<any>(`${apiUrl}/tasks/updateTask/${editId}`, productData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`
      }
    });
  }


  getAllTasks(searchTerm: string, sortValue: number): Promise<any> {
    return this.http.post<any>(`${apiUrl}/tasks/getAllTasks`, {
      searchValue: searchTerm,
      sortValue: sortValue
    }, {
      headers: { Authorization: `${localStorage.getItem("token")}` }
    }).toPromise();
  }




}
