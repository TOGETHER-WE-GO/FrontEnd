import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, PlaceService } from '../shared/services';
import { PlaceFeatureType } from '../shared/models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  form: any = {};
  blockedPanel = false;
  locations: PlaceFeatureType[] = [];
  private subscription: Subscription[] = [];

  constructor(private authService: AuthService, private placeService: PlaceService, private router: Router) {}

  ngOnInit(): void {
    this.subscription.push(
      this.placeService
        .getPlaceLocation()
        .subscribe((response: PlaceFeatureType[]) => {
          this.locations = response;
        })
    );
  }

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
          this.blockedPanel = false;
        },
        (error) => {
          setTimeout(() => {
            this.blockedPanel = false;
          }, 1000);
        }
      )
    );
  }
}
