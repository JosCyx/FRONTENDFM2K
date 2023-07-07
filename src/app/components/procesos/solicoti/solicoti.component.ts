import { Component } from '@angular/core';

@Component({
  selector: 'app-solicoti',
  templateUrl: './solicoti.component.html',
  styleUrls: ['./solicoti.component.css']
})
export class SolicotiComponent {
  changeview: string = 'consultar';

  changeView(view: string): void {
    this.changeview = view;
  }
}
