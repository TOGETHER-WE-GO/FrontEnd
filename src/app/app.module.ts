import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { authInterceptorProviders } from './shared/interceptors/auth.interceptor';
import { UINotificationService } from './shared/services';
import { AuthGuard } from './shared/guard/auth.guard';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule ,
    NgxPaginationModule,
    BrowserAnimationsModule
  ],
  providers: [authInterceptorProviders, UINotificationService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
