import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sp-destino',
  templateUrl: './sp-destino.component.html',
  styleUrls: ['./sp-destino.component.css']
})
export class SpDestinoComponent implements OnInit {
  @Input() tipoSol!: number;
  @Input() noSol!: number;
  @Input() estadoSol!: string;
  
  constructor() { }

  ngOnInit(): void {
  }
}
