import { Injectable } from '@angular/core';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeTrackingService {
  private view = 0;
  public intervalSubscription: any;
  public isRunning: boolean = false;

  startTracking() {
    this.intervalSubscription = interval(5000).subscribe(() => {
      this.view += 1;
      console.log(this.view)
    });
  }

  stopTracking() {
    this.intervalSubscription.unsubscribe();
  }

  getTimeSpent() {
    return this.view;
  }

  resetTimeSpent(){
    this.view = 0;
  }
}
