import { Component } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  constructor(private globalService: GlobalService,private router: Router) { }

  goRequests():void{
    this.globalService.appSelected = true;
    this.globalService.sol = true;
    this.router.navigate(['mainconfig']);
    console.log(this.globalService.appSelected);
    console.log(this.globalService.sol);
  }

  goAdmin():void{
    this.globalService.appSelected = true;
    this.globalService.admin = true;
    this.router.navigate(['mainsec']);
  }
}
