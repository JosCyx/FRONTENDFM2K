import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit{
  constructor(private globalService: GlobalService,private router: Router) { }

  ngOnInit():void{
    this.globalService.appSelected = false;
  }
  goRequests():void{
    this.globalService.appSelected = true;
    this.router.navigate(['mainconfig']);
  }

  goAdmin():void{
    this.globalService.appSelected = true;
    this.router.navigate(['mainsec']);
  }
}
