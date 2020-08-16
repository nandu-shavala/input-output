import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(catchError(err => {
      let errorMessage = 'Unknown error!';
      if (err.error instanceof ErrorEvent) {
        // Client-side errors
        errorMessage = `Error: ${err.error.message}`;
      } else {
        // Server-side errors
        errorMessage = `Error Code: ${err.status}\nMessage: ${err.message}`;
      }
      this._snackBar.open(errorMessage, "X", { duration: 10000 });
      return throwError(errorMessage);
    }))
  }
}
