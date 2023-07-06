import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
export class TransmitService {
  private transmit$ = new BehaviorSubject<any>({type: '', data: Object});
  selectedTransmit$ = this.transmit$.asObservable();

  setValue(value: any) {
    this.transmit$.next(value);
  }
}
