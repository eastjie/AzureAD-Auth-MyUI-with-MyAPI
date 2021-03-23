import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
})
export class HomeComponent implements OnInit {
  userData$: Observable<any>;
  dataFromAzureProtectedApi$: Observable<any>;
  isAuthenticated$: Observable<boolean>;
  constructor(
    private authservice: AuthService,
    private httpClient: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.userData$ = this.authservice.userData;
    this.isAuthenticated$ = this.authservice.signedIn;
  }

  callApi() {
    this.dataFromAzureProtectedApi$ = this.httpClient
      .get('https://localhost:44390/weatherforecast')
      .pipe(catchError((error) => of(error)));
  }
  login() {
    this.authservice.signIn();
  }

  refreshSession() {
    this.authservice.forceRefreshSession().subscribe((result) => console.log(result));
  }

  logout() {
    this.authservice.signOut();
  }

  openProtectTab(){
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/protected'])
    );

    window.open(url, '_blank');
  }
}
