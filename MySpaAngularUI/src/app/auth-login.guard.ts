import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const STORAGE_KEY = 'redirect';

@Injectable({ providedIn: 'root' })
export class AuthLoginGuard implements CanActivate {
  constructor(private oidcSecurityService: OidcSecurityService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.oidcSecurityService.isAuthenticated$.pipe(
      map((isAuthorized: boolean) => {

        if (isAuthorized) {
          return true;
        }
        this.oidcSecurityService.authorize();
        return false;
      })
    );
  }
}
