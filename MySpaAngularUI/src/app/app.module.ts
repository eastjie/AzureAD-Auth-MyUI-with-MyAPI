import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AuthModule, OidcConfigService, LogLevel } from 'angular-auth-oidc-client';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { ProtectedComponent } from './protect/protected.component';
import { AuthLoginGuard } from './auth-login.guard';

export function configureAuth(oidcConfigService: OidcConfigService) {
  return () =>
    oidcConfigService.withConfig({
            stsServer: 'https://login.microsoftonline.com/3f89ee74-xxxxxxxxxxxxxxxxxxxx/v2.0',
            authWellknownEndpoint: 'https://login.microsoftonline.com/3f89ee74-xxxxxxxxxxxxxxxx/v2.0',
            redirectUrl: window.location.origin,
            clientId: 'xxxxxxxxxxxxxxxxx',
            scope: 'openid profile offline_access email api://xxxxxxxxxxxxxxxxxx/webapi',
            responseType: 'code',
            silentRenew: true,
            useRefreshToken: true,
            ignoreNonceAfterRefresh: true,
            maxIdTokenIatOffsetAllowedInSeconds: 600,
            issValidationOff: false, // this needs to be true if using a common endpoint in Azure
            autoUserinfo: false,
            logLevel: LogLevel.Debug,
            customParams: {
              prompt: 'select_account', // login, consent
            },
    });
}

@NgModule({
  declarations: [AppComponent, HomeComponent, UnauthorizedComponent, ProtectedComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'protected', component: ProtectedComponent, canActivate: [AuthLoginGuard]},
    { path: 'unauthorized', component: UnauthorizedComponent },
], { relativeLinkResolution: 'legacy' }),
    AuthModule.forRoot(),
    HttpClientModule,
  ],
  providers: [
    OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configureAuth,
      deps: [OidcConfigService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
