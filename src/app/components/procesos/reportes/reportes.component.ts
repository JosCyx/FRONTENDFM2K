import { Component } from '@angular/core';
import { ParamsConfigService } from 'src/app/services/comunicationAPI/seguridad/params-config.service';

interface Params{
  name: string;
  value: any;
}

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})

export class ReportesComponent {
  //guarda los parametros con los que se van a relizar la busqueda
  paramsList: Params[] = [];

  //guarda los parametros de busqueda por defecto
  paramsListSearch: any[] = [];

  selectedParam: string = '0';

  constructor(
    private paramsConfigService: ParamsConfigService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      
      this.paramsConfigService.getParamsSearch().subscribe(
        (data) => {
          this.paramsListSearch = data;
        }
        );
    }, 200);
  }

  selectParametro(){
    //verificr si el parametro seleccionado ya esta en la lista de parametros, si no esta se agrega
    if(this.paramsList.find(param => param.name == this.selectedParam) == undefined){
      this.paramsList.push({name: this.selectedParam, value: ''});
    }
  }
}
