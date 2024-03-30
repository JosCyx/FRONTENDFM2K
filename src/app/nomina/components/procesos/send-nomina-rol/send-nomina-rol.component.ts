import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { NominaRolService } from 'src/app/services/comunicationAPI/nomina/nomina-rol.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';


@Component({
  selector: 'app-send-nomina-rol',
  templateUrl: './send-nomina-rol.component.html',
  styleUrls: ['./send-nomina-rol.component.css']
})
export class SendNominaRolComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['date', 'id', 'name', 'send', 'sendto', 'senddate', 'sendno', 'resend', 'sendOK'];
  displayedColumns2: string[] = ['emp', 'email', 'message'];

  dataSource: any = [];
  dataSourceBlock: any = [];
  failMail: any[] = [];

  fechaConsulta: any;
  consulted: boolean = false;

  nameBusqueda: string = '';

  loading = false;
  loadingc = false;
  loadingo = false;

  constructor(
    private nominaRolService: NominaRolService,
    private dialogService: DialogServiceService
  ) { }

  ngOnInit(): void {
  }

  consultarNomina() {
    this.consulted = false;
    this.loading = true;
    this.dataSource = [];
    this.nominaRolService.getNominaRolList(this.fechaConsulta).subscribe(
      (data) => {
        if (data.length == 0) {
          this.callMensaje('Error, no existen registros con la fecha seleccionada. Seleccione una quincena o un fin de mes.', false);
          this.loading = false;
          return;
        }

        data.forEach((element: any) => { 
          element.spinner = false;
          //eliminar el tiempo y dejar solo la fecha
          let dateRol = new Date(element.fecha);
          element.fecha = dateRol.toLocaleDateString();

          //formatear la fecha de envio al formato yyyy/mm/dd hh:mm
          if (element.fechaEnvio != null) {
            let date = new Date(element.fechaEnvio);
            element.fechaEnvio = date.toLocaleString();
          }
        });

        //convertir el array en un objeto de tipo MatTableDataSource y asignar el paginator
        this.dataSource = new MatTableDataSource<any>(data);
        this.dataSource.paginator = this.paginator;
        this.dataSourceBlock = _.cloneDeep(data);

        this.consulted = true;
        this.loading = false;
        //console.log(data);
      },
      (error) => {
        console.log(error);
        if (error.status == 400) {
          this.callMensaje('Por favor escoja una fecha antes de consultar.', false);
        }
        this.consulted = false;
        this.loading = false;
      }
    );
  }

  formatFecha() {

  }

  searchbyName(){
    this.dataSource.filter = this.nameBusqueda.trim().toLowerCase();
  }

  resetSearch(){
    this.nameBusqueda = '';
    this.dataSource = new MatTableDataSource<any>(_.cloneDeep(this.dataSourceBlock));
    this.dataSource.paginator = this.paginator;
  }

  callMensaje(mensaje: string, type: boolean) {
    this.dialogService.openAlertDialog(mensaje, type);
  }

  sendAllNomina() {
    this.failMail = [];
    this.loadingc = true;
    this.nominaRolService.sendRolNomina(this.fechaConsulta).subscribe(
      (data: any) => {
        this.loadingc = false;
        this.callMensaje(`Se han enviado los roles de pago correctamente. Correos enviados: ${data.successfulEmails}`, true);
        this.consultarNomina();
        //console.log(data);

        this.failMail = data.failedEmails;

        setTimeout(() => {
          this.setResultadoEnvio();
          
        }, 200);
      },
      (error) => {
        this.loadingc = false;
        console.log(error);
        this.callMensaje(`Error, no se ha podido enviar la nómina. Por favor intente nuevamente. Codigo de error: ${error.status} `, false);
      }
    );
  }

  sendOnePdf(element: any) {
    this.loadingo = true;
    element.spinner = true;

    this.nominaRolService.sendOnePdf(this.fechaConsulta, element.ruc).subscribe(
      (data) => {
        this.loadingo = false;
        element.spinner = false;
        this.callMensaje('Se ha enviado el rol de pago correctamente.', true);
        this.consultarNomina();
      },
      (error) => {
        this.loadingo = false;
        element.spinner = false;
        console.log(error);

        this.callMensaje(`Error, no se ha podido enviar el pdf. Por favor intente nuevamente. Info de error: ${error.error} Codigo: ${error.status} `, false);
      }
    );

  }

  /**
   * Establece el resultado de envío para cada elemento de datos en la fuente de datos.
   * Si el nombre del empleado se encuentra en la lista de correos fallidos (failMail),
   * se establece el resultado de envío como 'ERROR', de lo contrario se establece como 'EXITO'.
   */
  setResultadoEnvio() {
    console.log("setResultadoEnvio");
    if (this.dataSource && this.dataSource.data) {
      this.dataSource.data.forEach((element: any) => {
        console.log('elemento:', element);
        let found = false; 
        this.failMail.forEach((mail: any) => {
          console.log(mail);
          if (element.nombre == mail.empleado) {
            found = true;
          }
        });
        element.resultadoEnvio = found ? 'ERROR' : 'EXITO';
      });
    }
  }
  

}
