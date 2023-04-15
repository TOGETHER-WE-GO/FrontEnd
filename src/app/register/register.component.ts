import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  form: any = {};
  blockedPanel = false;

  private subscription: Subscription[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.forEach((element) => {
      element.unsubscribe();
    });
  }

  onSubmit(): void {
    this.blockedPanel = true;

    this.subscription.push(
      this.authService.register(this.form).subscribe(
        (response: any) => {
          if (response.status === 200) {
            this.router.navigateByUrl('/login');
          }
        },
        (error) => {
          setTimeout(() => {

          }, 1000);
        }
      )
    );
  }
}
