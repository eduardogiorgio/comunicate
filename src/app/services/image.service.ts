import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry, timeout } from 'rxjs/operators';

@Injectable()
export class ImageService{
  private query: string;
  private API_KEY: string = environment.PIXABAY_API_KEY;
  private API_URL: string = environment.PIXABAY_API_URL;
  private URL: string = this.API_URL;
 

  constructor(private http: HttpClient){ }

  getImages(query: string,page: number = 1,per_page: number = 10): Observable<any[]> {
    query = query.trim();
  
    // Add safe, URL encoded search parameter if there is a search term
    const options = query ?
     { params: new HttpParams().set('key',this.API_KEY ).set('lang','es')
                               .set('q', query).set('page',page.toString())
                               .set('per_page',per_page.toString())
                               
                                } : {};
  
    return this.http.get<any[]>(this.URL , options)
      .pipe(
       /* catchError(this.handleError<never[]>('searchImage', [])) */
      );
  }

  /*
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
  */
}
