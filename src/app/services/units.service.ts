import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Unites } from '../types/unites.interface';

@Injectable({
  providedIn: 'root',
})
export class UnitsService {
  readonly apiUrl =
    'https://test-frontend-developer.s3.amazonaws.com/data/locations.json';

  constructor(private httpClient: HttpClient) {}

  public http = this.httpClient;

  getAllUnits(): Observable<Unites> {
    return this.http.get<Unites>(this.apiUrl);
  }
}
