import { Component } from '@angular/core';

@Component({
  selector: 'app-ruteo',
  templateUrl: './ruteo.component.html',
  styleUrls: ['./ruteo.component.css']
})
export class RuteoComponent {
  areas = ['Operaciones', 'Sistemas', 'Marketing', 'Contabilidad'];
  area:string='';
  tipo_solicitud:string='';
  niveles = [
    { area: 'Operaciones', niveles: [false, false, false, false, false, false, false] },
    { area: 'Sistemas', niveles: [false, false, false, false, false, false, false] },
    { area: 'Marketing', niveles: [false, false, false, false, false, false,false] },
    { area: 'Contabilidad', niveles: [false, false, false, false, false, false, false] }
  ];
  selectedRow: number = -1;
  currentPage: number = 0;
  itemsPerPage: number = 1;

  constructor() {}

  getNivelesByArea(area: string): boolean[] {
    const nivelObj = this.niveles.find(nivel => nivel.area === area);
    return nivelObj ? nivelObj.niveles : [];
  }

  isNivelChecked(area: string, index: number): boolean {
    const niveles = this.getNivelesByArea(area);
    return niveles[index - 1];
  }

  toggleNivel(area: string, index: number): void {
    const niveles = this.getNivelesByArea(area);
    niveles[index - 1] = !niveles[index - 1];
  }

  toggleDropdown(index: number): void {
    this.selectedRow = (this.selectedRow === index) ? -1 : index;
  }
}
