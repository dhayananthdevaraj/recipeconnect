import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiUrl } from '../../apiConfig';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }


  login(formData: any): Observable<HttpResponse<any>> {
    const loginUrl = `${apiUrl}/api/auth/login`;
    return this.http.post<any>(loginUrl, formData, { observe: 'response' });
  }

  register(userData: any): Observable<any> {
    const registerUrl = `${apiUrl}/api/auth/register`;
    return this.http.post(registerUrl, userData);
  }
}
