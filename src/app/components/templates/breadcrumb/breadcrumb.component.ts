import { Component, OnInit } from '@angular/core';
import { BreadcrumbServicesService } from './services/breadcrumb-services.service';


@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {
  breadcrumbs: any[] = [];

  constructor(private BreadCrSer:BreadcrumbServicesService) {
  }

  ngOnInit(): void {
    this.BreadCrSer.breadcrumbs$.subscribe((breadcrumbs) => {
      console.log("esta es ",breadcrumbs)
      this.breadcrumbs = breadcrumbs;
    });
    // this.breadcrumbs = this.BreadCrSer.getBreadcrumbs();
  }
  
}
