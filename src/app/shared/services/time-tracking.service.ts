import { Injectable } from '@angular/core';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeTrackingService {
  private timeSpent = 0;
  private intervalSubscription: any;

  startTracking() {
    this.intervalSubscription = interval(5000).subscribe(() => {
      this.timeSpent += 5;
      console.log(this.timeSpent)
    });
  }

  stopTracking() {
    this.intervalSubscription.unsubscribe();
  }

  getTimeSpent() {
    return this.timeSpent;
  }
}
