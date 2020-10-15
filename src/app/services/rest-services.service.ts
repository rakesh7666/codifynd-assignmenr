import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestServicesService {

  constructor(private http: HttpClient) { }

  getStockListing(symbol: string) {
    let url = "https://financialmodelingprep.com/api/v3/quote-short/" + symbol + "?apikey=b95f3297b2989e3fe735255086f2a453";
    return this.http.get(url, {}).pipe(
      map((response: Response) => {
        return response;
      }), catchError((error: any) => {
        return throwError(error);
      }));
  }

}
