import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FichaGestEventoService } from 'src/app/services/comunicationAPI/gest-eventos/ficha-gest-evento.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { GlobalGestEventosService } from 'src/app/services/global-gest-eventos.service';

interface ValueList {
  key: number;
  value: string;
}

interface Filter {
  key: any;
  value?: string;
  type: string;
}

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.css']
})
export class FilterModalComponent implements OnInit{

  valuesList: ValueList[] = [];

  selectedValue: any;

  tpContratoList: any[] = [];
  espaciosList: any[] = [];

  constructor(
    private gestEventService: FichaGestEventoService,
    private dialogService: DialogServiceService,
    private globalGEVService: GlobalGestEventosService,
    public dialogRef: MatDialogRef<FilterModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: string }
  ) {
  }

  ngOnInit() {

    if (this.data.type == 'tipo de contrato') {
      this.gestEventService.getTipoContratoList().subscribe(
        (data: any) => {
          this.tpContratoList = data;
          this.selectFilter(this.data.type);
        },
        (error) => {
          console.log(error);
        }
      );
    } else if (this.data.type == 'espacio') {
      this.gestEventService.getLocalidadList(this.globalGEVService.idTipoContratoSelected).subscribe(
        (data: any) => {
          //console.log(data);
          this.espaciosList = data;
          this.selectFilter(this.data.type);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  //carga los valores del tipo de filtro seleccionado
  selectFilter(filter: string) {
    switch (filter) {
      case 'tipo de contrato':
        this.valuesList = this.tpContratoList.map(x => {
          return { key: x.contrId, value: x.contrNombre };
        });
        break;
      case 'espacio':
        this.valuesList = this.espaciosList.map(x => {
          return { key: x.id, value: x.lugar };
        });
        break;
      default:
        break;
    }
  }

  selectValue() {
    if (this.data.type == 'tipo de contrato') {
      this.globalGEVService.idTipoContratoSelected = this.selectedValue;
    }

    const value = this.valuesList.find(value => value.key == this.selectedValue)?.value;

    const filtro: Filter = {
      key: this.selectedValue,
      value: value,
      type: this.data.type,
    }

    this.dialogService.paramFilterSubject.next(filtro);

    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
