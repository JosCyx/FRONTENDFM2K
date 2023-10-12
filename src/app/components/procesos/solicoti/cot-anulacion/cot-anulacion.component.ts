import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cot-anulacion',
  templateUrl: './cot-anulacion.component.html',
  styleUrls: ['./cot-anulacion.component.css']
})
export class CotAnulacionComponent {

  @Input() tipoSol: number = 0;
  @Input() noSol: number = 0;
  @Input() estadoSol!: string;

  constructor() { }

  ngOnInit(): void {
    console.log(this.tipoSol, this.noSol, this.estadoSol);
  }

}
