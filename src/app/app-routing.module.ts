import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./protected-zone/protected-zone.module').then(
        (m) => m.ProtectedZoneModule
      ),
    canActivate: [AuthGuard],
    data: {
      functionCode: 'DASHBOARD',
    },
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./register/register.module').then((m) => m.RegisterModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'auth-callback',
    loadChildren: () =>
      import('./auth-callback/auth-callback.module').then(
        (m) => m.AuthCallbackModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
