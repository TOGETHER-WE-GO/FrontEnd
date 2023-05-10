import { Component, OnInit } from '@angular/core';
import { SignalRService, TokenStorageService } from 'src/app/shared/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private signalrService: SignalRService, private tokenService: TokenStorageService) {

   }

  ngOnInit(): void {
    
  }

}
