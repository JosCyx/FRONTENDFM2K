import { Component } from '@angular/core';

@Component({
  selector: 'app-allrequest',
  templateUrl: './allrequest.component.html',
  styleUrls: ['./allrequest.component.css']
})
export class AllrequestComponent {

  changeview: string = 'consultar';

  
  changeView(view: string): void {
    this.changeview = view;
  }
}
