import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ProveedorService } from 'src/app/services/comunicationAPI/seguridad/proveedor.service';
import { ProvCotizacionService } from 'src/app/services/comunicationAPI/solicitudes/prov-cotizacion.service';
import { SendEmailService } from 'src/app/services/comunicationAPI/solicitudes/send-email.service';
import { CabeceraCotizacion } from 'src/app/models/procesos/solcotizacion/CabeceraCotizacion';
import { DetalleCotizacion } from 'src/app/models/procesos/solcotizacion/DetalleCotizacion';
import { ParamsConfigService } from 'src/app/services/comunicationAPI/seguridad/params-config.service';
import { SharedService } from 'src/app/services/shared.service';
import { CookieService } from 'ngx-cookie-service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';

interface selectedProveedor {
  ruc: string,
  nombre: string,
  telefono: string,
  correo: string,
  validEmail: boolean,
  direccion: string,
  verify: number
}


@Component({
  selector: 'app-cot-proveedores',
  templateUrl: './cot-proveedores.component.html',
  styleUrls: ['./cot-proveedores.component.css']
})
export class CotProveedoresComponent implements OnInit {
  //elemento que hace referencia al html para enviar al correo
  @ViewChild('solCotTemplate') solCotTemplate!: ElementRef;

  //valores para identificar la solicitud cargada
  @Input() tipoSol: number = 0;
  @Input() noSol: number = 0;
  @Input() viewElement!: boolean;
  @Input() estadoSol!: string;
  @ViewChild('miModal') miModal: any;
  userId: string = this.coockieService.get('userIdNomina');

  //variables para controlar comportamiento de la pagina
  actionProv: string = 'consultar';
  hasProvs: boolean = false;

  //variables de acciones de proveedores asignados
  idDltProv!: number;
  emailProv!: string[];
  nombreProv!: string;

  //formulario para añadir un nuevo proveedor
  dataForm = new FormGroup({
    newRuc: new FormControl("", [
      Validators.required
    ]),
    newNombre: new FormControl("", [
      Validators.required
    ]),
    newDireccion: new FormControl("", [
      Validators.required
    ]),
    newEmail: new FormControl("", [
      Validators.required,
      Validators.email
    ]),
    newPhone: new FormControl("", [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
      Validators.minLength(10),
      Validators.maxLength(10)
    ]),
    newCodePhone: new FormControl("593", [
      Validators.required
    ])
  });

  get Ruc(): FormControl {
    return this.dataForm.get("newRuc") as FormControl;
  }

  get Nombre(): FormControl {
    return this.dataForm.get("newNombre") as FormControl;
  }

  get Direccion(): FormControl {
    return this.dataForm.get("newDireccion") as FormControl;
  }

  get Email(): FormControl {
    return this.dataForm.get("newEmail") as FormControl;
  }

  get Phone(): FormControl {
    return this.dataForm.get("newPhone") as FormControl;
  }

  get CodePhone(): FormControl {
    return this.dataForm.get("newCodePhone") as FormControl;
  }

  //variables de busqueda
  tipoBusqProv: string = 'nombre';
  terminoBusq: string = '';
  isSearched: boolean = true;
  page: number = 1; // Inicializa la página actual en 1
  showmsj: boolean = false;
  showmsjerror: boolean = false;
  showadv: boolean = false;
  msjError: string = '';
  msjExito: string = '';

  //lista de proveedores seleccionados
  proveedorListSelected: selectedProveedor[] = [];

  //resultados de busqueda
  proveedoresList$!: Observable<any[]>;
  proveedoresList: any[] = [];

  //lista para los proveedores asignados a la cotizacion
  assignedProvs$!: Observable<any[]>;
  assignedProvs: any[] = [];
  comprasData: any[] = []

  //variables para el contenido del correo
  mail_asunto: string = 'FUNDACION MALECON 2000 - SOLICITUD DE COTIZACION';

  @Input() cabSolCotAsunto!: any;
  @Input() mail_detalles: any[] = [];
  newFecha: Date = new Date();
  sol_fecha!: string;
  sol_asunto!: string;
  emailContent!: string;

  constructor(private provService: ProveedorService,
    private provCotService: ProvCotizacionService,
    private sendMailService: SendEmailService,
    private paramService: ParamsConfigService,
    private sharedService: SharedService,
    private coockieService: CookieService,private dialogService:DialogServiceService) { 
      this.sharedService.cotProveedores$.subscribe(() =>{
        this.RecorrerPro();
      });
    }

  ngOnInit(): void {
    console.log(this.mail_detalles);
    this.getProvCotizacion();

    /*setTimeout(()=>{
      this.sol_fecha = this.mail_cabecera.cabSolCotFecha;
      this.sol_asunto = this.mail_cabecera.cabSolCotAsunto;
    },200)*/
  }

  //tranforma la fecha actual en un formato especifico "Lunes, 31 de julio de 2023"
  formatDateToSpanish(date: Date): string {
    const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const months = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
      "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayOfWeek}, ${dayOfMonth} de ${month} de ${year}`;
  }

  searchProveedor() {
    this.page = 1;
    if (this.terminoBusq.trim() == '') {
      this.proveedoresList = [];
      this.isSearched = false;

      const msjError = 'Ingrese un nombre o ruc para buscar proveedores.';
      this.callMensaje(msjError,false)

      setTimeout(() => {
        this.isSearched = true;
      }, 3000)


    } else {
      if (this.tipoBusqProv == 'nombre') {
        //console.log("busqueda por nombre");
        this.isSearched = false;
        this.proveedoresList$ = this.provService.getProveedorByNombre(this.terminoBusq);

        this.proveedoresList$.subscribe(
          response => {
            this.proveedoresList = response;
          },
          error => {
            if (error.status == 404) {
              const msjError = 'No se han encontrado proveedores con el dato ingresado, intente nuevamente.';
              this.callMensaje(msjError,false)
            }
            this.proveedoresList = [];
            console.log("Error:", error);
          }
        );

      } else if (this.tipoBusqProv == 'ruc') {
        //console.log("busqueda por ruc");
        this.isSearched = false;
        this.proveedoresList$ = this.provService.getProveedorByRUC(this.terminoBusq);

        this.proveedoresList$.subscribe(
          response => {
            this.proveedoresList = response;
          },
          error => {
            if (error.status == 404) {
              const msjError = 'No se han encontrado proveedores con el dato ingresado, intente nuevamente.';
              this.callMensaje(msjError,false)
            }
            this.proveedoresList = [];
            console.log("Error:", error);
          }
        );
      }
    }
  }

  nextPage(): void {
    console.log("nextPage", this.page);
    if(this.proveedoresList.length <= 10 ){
      this.page=1;
    }else if(this.page >= this.proveedoresList.length/10){
      this.page=this.page;
    }else{
      this.page++
    }
  }

  //decrementa el valor de la variable que controla la pagina actual que se muestra
  prevPage(): void {
    if (this.page > 1) {
      console.log("prevPage", this.page);
      this.page--; // Disminuir currentPage en uno si no está en la primera página
    }
  }

  selectAction(action: string) {
    this.actionProv = action;
  }

  selectProveedor(prov: any) {
    //console.log(prov);

    // Verificar si el proveedor ya está agregado a la lista
    if (this.verifyProvExists(prov)) {
      //console.log("El proveedor ya ha sido añadido a la lista.");
    } else {
      // Crear una nueva instancia de selectProveedor con valores de prov
      const nuevoProveedor: selectedProveedor = {
        ruc: prov.prov_ruc || '',
        nombre: prov.prov_nombre || '',
        telefono: prov.prov_telefono || '',
        correo: '',
        direccion: '',
        validEmail: true,
        verify: 1
      };

      // Agregar la nueva instancia a la lista proveedorListSelected
      this.proveedorListSelected.push(nuevoProveedor);

    }

  }

  verifyProvExists(prov: any) {
    return this.proveedorListSelected.some((item: any) => {
      return (
        item.nombre === prov.prov_nombre &&
        item.ruc === prov.prov_ruc
      );
    });

  }

  verifyPhoneEmailProv(): boolean {
    for (let prov of this.proveedorListSelected) {
      if (!prov.telefono || prov.telefono === '' || !prov.correo || prov.correo === '') {
        return false;
      }
    }
    return true;
  }

  verifyValidEmail(correo: string): boolean {
    const patronCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return patronCorreo.test(correo);
  }

  validarProvEmail(index: number) {

    for (let i = 0; i < this.proveedorListSelected.length; i++) {
      const element = this.proveedorListSelected[i];

      if (i == index) {
        //console.log(element.correo);
        element.validEmail = this.verifyValidEmail(element.correo);
        //console.log(element);
      }

    }
  }


  deleteProvSelected(id: number) {
    this.proveedorListSelected.splice(id, 1);
  }

  addProveedor() {
    if (
      this.dataForm.valid
    ) {
      // Si todos los campos están llenos, agrega el proveedor a la lista
      const newPrv = {
        ruc: this.dataForm.value.newRuc!,
        nombre: this.dataForm.value.newNombre!,
        telefono: this.dataForm.value.newCodePhone! + ' ' + this.dataForm.value.newPhone!,
        correo: this.dataForm.value.newEmail!,
        direccion: this.dataForm.value.newDireccion!,
        validEmail: true,
        verify: 0
      }
      //console.log(this.dataForm.value)
      this.proveedorListSelected.push(newPrv);

      //limpiar el formulario
      this.clearNewPrv();
    } else {
      const msjError = 'Error, no se han completado todos los datos necesarios.';
      this.callMensaje(msjError,false)
      // Muestra una alerta o mensaje de error al usuario indicando que los campos deben llenarse.
    }
  }

  FormularioVacio(): boolean {
    const formControls: { [key: string]: any } = this.dataForm.controls;
    let formularioCompleto = true;

    Object.keys(formControls).forEach(controlName => {
      if (formControls[controlName].value === '' || formControls[controlName].value === null ) {
        formularioCompleto = false;
      }
    });
    return formularioCompleto;
  }

  clearNewPrv() {
    this.dataForm.reset();
  }

  saveProvDB() {
    if (this.verifyPhoneEmailProv()) {
      //console.log(this.proveedorListSelected);
      for (let prov of this.proveedorListSelected) {

        if (prov.validEmail === false) {
          const error=`Error al asignar el proveedor ${prov.nombre}, el correo ingresado no es válido, por favor intente nuevamente.`;
          this.callMensaje(error,false)
        } else {
          const data = {
            cotProvTipoSolicitud: this.tipoSol,
            cotProvNoSolicitud: this.noSol,
            cotProvRuc: prov.ruc,
            cotProvNombre: prov.nombre,
            cotProvTelefono: prov.telefono,
            cotProvCorreo: prov.correo,
            cotProvDireccion: prov.direccion,
            cotProvVerify: prov.verify
          }
          this.provCotService.addProvCotizacion(data).subscribe(
            response => {
              //console.log("Proveedor guardado exitosamente: ", prov.nombre);

              this.actionProv = 'consultar';
            },
            error => {
              if (error.status == 409) {
                //console.log("Error, este proveedor ya se ha asignado:", error);
                const msjError = `El proveedor ${data.cotProvNombre} ya está asignado a esta solicitud.`;
                this.callMensaje(msjError,false)
                setTimeout(() => {
                  this.actionProv = 'consultar';
                  this.isSearched = true;
                }, 3000)

              } else {
                console.log("Error:", error);
              }
            }
          );
        }
      }
      this.hasProvs = true;
      this.proveedorListSelected = [];
      this.proveedoresList = [];
      this.terminoBusq = '';

      setTimeout(() => {
        this.getProvCotizacion();
      }, 100);
    } else {
      alert("Debe llenar todos los campos requeridos antes de guardar los proveedores.")
    }

  }

  getProvCotizacion() {
    //almacena los proveedores que pertenezcan a la solicitud consultada
    this.assignedProvs$ = this.provCotService.getProvCot(this.tipoSol, this.noSol);
    this.assignedProvs$.subscribe(
      response => {
        //console.log("Consulta exitosa: ", response);
        this.hasProvs = true;

        //guardar la lista de proveedores en una lista local
        this.assignedProvs = response;

      },
      error => {
        console.log("Error:", error);
      }
    );
      this.getComprasData();
  }

  getComprasData(){

    this.paramService.getParamsByIdentity('COMPRAS').subscribe(
      response => {
        this.comprasData = response;
        //console.log(this.comprasData[0]);
      },
      error => {
        console.log("Error: ", error);
      }
    );

  }

  deleteProvAssigned() {
    this.provCotService.deleteProvCot(this.idDltProv).subscribe(
      response => {
        //console.log("Proveedor eliminado: ", response);
        this.getProvCotizacion();
      },
      error => {
        console.log("Error:", error);
      }
    );
  }

  //guarda el id del proveedor para eliminar
  selectIdDltProv(id: number) {
    this.idDltProv = id;
  }

  //guarda el correo del proveedor para enviar email
  saveDataProv() {
     this.sol_fecha = this.formatDateToSpanish(this.newFecha);
     this.sol_asunto = this.cabSolCotAsunto;
   }




  //enviar el correo al proveedor seleccionado
  sendMailtoProv() {
    let exito:number=0;
    for (let i=0;  i < this.assignedProvs.length; i++) {
      const prov = this.assignedProvs[i];
      if(prov.cotProvVerify == 1){

        this.setTemplate(prov.cotProvNombre);
        
  
        const data = {
          destinatario: prov.cotProvCorreo,
          asunto: this.mail_asunto,
          contenido: this.emailContent
        }
        this.sendMailService.sendMailto(data).subscribe(
          response => {
            if(i == this.assignedProvs.length-1){
              exito=1;
              const msjExito = 'Correos enviados exitosamente.';
              this.callMensaje(msjExito,true);
              console.log("Ultimo correo enviado ")
            }
            console.log("Exito",response);

          },
          error => {
            console.log(`Error, no se ha podido enviar el correo al proveedor ${prov.cotProvNombre}`, error)
            exito=0;
            const msjError = `Error, no se ha podido enviar el correo al proveedor ${prov.cotProvNombre}, intente nuevamente.`;
            this.callMensaje(msjError,false)
          }
        );
      }
    }
    this.sendMailCompras();
  }
  sendMailCompras(){
    for(let cmp of this.comprasData){
      this.setTemplate(cmp.identify);

      const data = {
        destinatario: cmp.content,
        asunto: this.mail_asunto,
        contenido: this.emailContent
      }
      this.sendMailService.sendMailto(data).subscribe(
        response => {
          //console.log(`Exito, se ha enviado el correo a ${cmp.identify}.`);
          // const msjExito = `Correos enviados exitosamente.`;
          // this.callMensaje(this.msjExito,true)
        },
        error => {
          console.log(`Error, no se ha podido enviar el correo al proveedor ${cmp.identify}`, error)
          const msjError = `Error, no se ha podido enviar el correo al proveedor ${cmp.identify}, intente nuevamente.`;
          this.callMensaje(this.msjError,false);
        }
      );
    }
  }

  //genera las tablas donde se mostrarán los items del detalle de la solicitud
  generateTableRows(): string {
    let rows = '';
    this.mail_detalles.forEach((det, i) => {
      rows += `<div class="u-row-container" style="padding: 0px;background-color: transparent">
      <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 900px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
        <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:900px;"><tr style="background-color: transparent;"><![endif]-->

          <!--[if (mso)|(IE)]><td align="center" width="225" style="background-color: #ffffff;width: 225px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
          <div class="u-col u-col-25" style="max-width: 320px;min-width: 225px;display: table-cell;vertical-align: top;">
            <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
              <!--[if (!mso)&(!IE)]><!-->
              <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                <!--<![endif]-->

                <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td style="width: 20%;overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">

                        <div style="font-size: 14px;  color: #000000; line-height: 140%; text-align: center; word-wrap: break-word;">
                          <p style="line-height: 140%;">${i+1}</p>
                        </div>

                      </td>
                      <td style="width: 40%;overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">

                        <div style="font-size: 14px;  color: #000000; line-height: 140%; text-align: center; word-wrap: break-word;">
                          <p style="line-height: 140%;">${det.det_descp}</p>
                        </div>

                      </td>
                      <td style="width: 20%;overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">

                        <div style="font-size: 14px;  color: #000000; line-height: 140%; text-align: center; word-wrap: break-word;">
                          <p style="line-height: 140%;">${det.det_unidad}</p>
                        </div>

                      </td>
                      <td style="width: 20%;overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">

                        <div style="font-size: 14px; color: #000000; line-height: 140%; text-align: center; word-wrap: break-word;">
                          <p style="line-height: 140%;">${det.det_cantidad}</p>
                        </div>

                      </td>
                    </tr>
                  </tbody>
                </table>

                <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                  <tbody>
                    <tr>
                      <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">

                        <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                          <tbody>
                            <tr style="vertical-align: top">
                              <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                <span>&#160;</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>

                      </td>
                    </tr>
                  </tbody>
                </table>

                

                <!--[if (!mso)&(!IE)]><!-->
              </div>
              <!--<![endif]-->
            </div>
          </div>
          <!--[if (mso)|(IE)]></td><![endif]-->
          
          <!--[if (mso)|(IE)]></td><![endif]-->
          <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
        </div>
      </div>
    </div>`;
      
    });
    return rows;
  }


  //setea el contenido del correo, recibe un parametro para definir el nombre del destinatario del correo
  setTemplate(nombre: string) {
    this.emailContent =
      `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      
      <head>
        <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <!--[if !mso]><!-->
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!--<![endif]-->
        <title></title>
      
        <style type="text/css">
          @media only screen and (min-width: 920px) {
            .u-row {
              width: 900px !important;
            }
            .u-row .u-col {
              vertical-align: top;
            }
            .u-row .u-col-25 {
              width: 225px !important;
            }
            .u-row .u-col-100 {
              width: 900px !important;
            }
          }
          
          @media (max-width: 920px) {
            .u-row-container {
              max-width: 100% !important;
              padding-left: 0px !important;
              padding-right: 0px !important;
            }
            .u-row .u-col {
              min-width: 320px !important;
              max-width: 100% !important;
              display: block !important;
            }
            .u-row {
              width: 100% !important;
            }
            .u-col {
              width: 100% !important;
            }
            .u-col>div {
              margin: 0 auto;
            }
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          table,
          tr,
          td {
            vertical-align: top;
            border-collapse: collapse;
          }
          
          p {
            margin: 0;
          }
          
          .ie-container table,
          .mso-container table {
            table-layout: fixed;
          }
          
          * {
            line-height: inherit;
          }
          
          a[x-apple-data-detectors='true'] {
            color: inherit !important;
            text-decoration: none !important;
          }
          
          table,
          td {
            color: #000000;
          }
        </style>
      
      
      
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Cabin:400,700" rel="stylesheet" type="text/css">
        <!--<![endif]-->
      
      </head>
      
      <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000">
        <!--[if IE]><div class="ie-container"><![endif]-->
        <!--[if mso]><div class="mso-container"><![endif]-->
        <table style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0">
          <tbody>
            <tr style="vertical-align: top">
              <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f9f9f9;"><![endif]-->
      
      
      
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 900px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #003399;">
                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:900px;"><tr style="background-color: #003399;"><![endif]-->
      
                      <!--[if (mso)|(IE)]><td align="center" width="900" style="width: 900px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div class="u-col u-col-100" style="max-width: 320px;min-width: 900px;display: table-cell;vertical-align: top;">
                        <div style="height: 100%;width: 100% !important;">
                          <!--[if (!mso)&(!IE)]><!-->
                          <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                            <!--<![endif]-->
      
                            <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                              <tbody>
                                <tr>
                                  <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 31px;font-family:'Cabin',sans-serif;" align="left">
      
                                    <div style="font-size: 14px; color: #e5eaf5; line-height: 140%; text-align: center; word-wrap: break-word;">
                                      <h2 align="center" style="text-align: center; margin-right: 0cm; margin-left: 0cm; font-size: 18pt; font-family: Calibri, sans-serif;">&nbsp;</h2>
                                      <h2 align="center" style="text-align: center; margin-right: 0cm; margin-left: 0cm; font-size: 18pt; font-family: Calibri, sans-serif;"><span style="font-family: Arial, sans-serif; line-height: 19.6px;">FUNDACION MALECON 2000</span></h2>
                                      <h3 align="center" style="text-align: center; margin-right: 0cm; margin-left: 0cm; font-size: 13.5pt; font-family: Calibri, sans-serif;"><span style="font-family: Arial, sans-serif; line-height: 19.6px;">SOLICITUD DE COTIZACION</span></h3>
                                    </div>
      
                                  </td>
                                </tr>
                              </tbody>
                            </table>
      
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
      
      
      
      
      
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 900px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:900px;"><tr style="background-color: #ffffff;"><![endif]-->
      
                      <!--[if (mso)|(IE)]><td align="center" width="900" style="width: 900px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div class="u-col u-col-100" style="max-width: 320px;min-width: 900px;display: table-cell;vertical-align: top;">
                        <div style="height: 100%;width: 100% !important;">
                          <!--[if (!mso)&(!IE)]><!-->
                          <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                            <!--<![endif]-->
      
                            <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                              <tbody>
                                <tr>
                                  <td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px;font-family:'Cabin',sans-serif;" align="left">
      
                                    <div style="font-size: 14px; line-height: 160%; text-align: center; word-wrap: break-word;">
                                      <p style="margin: 0cm; font-size: 11pt; font-family: Calibri, sans-serif; line-height: 160%; text-align: left;"><strong><span style="font-family: Arial, sans-serif; line-height: 22.4px;">Fecha: </span></strong><span style="font-family: Arial, sans-serif; line-height: 22.4px;"><em>${this.sol_fecha}</em>&nbsp; &nbsp; &nbsp; &nbsp;<strong>Para: </strong><em>${nombre}</em></span></p>
                                      <p style="margin: 0cm; font-size: 11pt; font-family: Calibri, sans-serif; line-height: 160%; text-align: left;"><strong><span style="font-family: Arial, sans-serif; line-height: 22.4px;">Descripción: </span></strong><em><span style="font-family: Arial, sans-serif; line-height: 22.4px;"> ${this.sol_asunto}</span></em></p>
                                    </div>
      
                                  </td>
                                </tr>
                              </tbody>
                            </table>
      
                            <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                              <tbody>
                                <tr>
                                  <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
      
                                    <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                            <span>&#160;</span>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
      
                                  </td>
                                </tr>
                              </tbody>
                            </table>
      
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
      
      
      
      
      
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 900px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:900px;"><tr style="background-color: transparent;"><![endif]-->

                      <!--[if (mso)|(IE)]><td align="center" width="225" style="background-color: #ffffff;width: 225px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                      <div class="u-col u-col-25" style="max-width: 320px;min-width: 225px;display: table-cell;vertical-align: top;">
                        <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                          <!--[if (!mso)&(!IE)]><!-->
                          <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                            <!--<![endif]-->

                            <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                              <tbody>
                                <tr>
                                  <td style="width: 20%;overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">

                                    <div style="font-size: 14px; font-weight: 700; color: #000000; line-height: 140%; text-align: center; word-wrap: break-word;">
                                      <p style="line-height: 140%;">ITEM</p>
                                    </div>

                                  </td>
                                  <td style="width: 40%;overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">

                                    <div style="font-size: 14px; font-weight: 700; color: #000000; line-height: 140%; text-align: center; word-wrap: break-word;">
                                      <p style="line-height: 140%;">DESCRIPCION</p>
                                    </div>

                                  </td>
                                  <td style="width: 20%;overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">

                                    <div style="font-size: 14px; font-weight: 700; color: #000000; line-height: 140%; text-align: center; word-wrap: break-word;">
                                      <p style="line-height: 140%;">UNIDAD</p>
                                    </div>

                                  </td>
                                  <td style="width: 20%;overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">

                                    <div style="font-size: 14px; font-weight: 700; color: #000000; line-height: 140%; text-align: center; word-wrap: break-word;">
                                      <p style="line-height: 140%;">CANTIDAD</p>
                                    </div>

                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                              <tbody>
                                <tr>
                                  <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">

                                    <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                            <span>&#160;</span>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>

                                  </td>
                                </tr>
                              </tbody>
                            </table>

                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
      
      
      
      
      
                ${this.generateTableRows()}
      
      
      
      
      
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 900px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #e5eaf5;">
                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:900px;"><tr style="background-color: #e5eaf5;"><![endif]-->
      
                      <!--[if (mso)|(IE)]><td align="center" width="900" style="background-color: #ffffff;width: 900px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div class="u-col u-col-100" style="max-width: 320px;min-width: 900px;display: table-cell;vertical-align: top;">
                        <div style="background-color: #ffffff;height: 100%;width: 100% !important;">
                          <!--[if (!mso)&(!IE)]><!-->
                          <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                            <!--<![endif]-->
      
                            <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                              <tbody>
                                <tr>
                                  <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
      
                                    <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                    <p style="line-height: 140%;">Solicito a ustedes me ayuden cotizando mi requerimiento adjunto:<br><br>
                                    </p>
                                      <p style="line-height: 140%;"><strong>Favor incluir esta información en su proforma, son requisitos indispensables (campos obligatorios):</strong><br>
                                        - Nombre del Proveedor<br>
                                        - Razón Social<br>
                                        - Ruc o Cédula<br>
                                        - Dirección o ubicación<br>
                                        - Teléfonos<br>
                                        - E-mail<br>
                                        - Fecha<br><br>
                                        </p>
                                        <p style="line-height: 140%;">Forma de Pago: De preferencia crédito 30 días<br>
                                          Detalle del Tiempo de Entrega<br><br>
                                          
                                          </p>
                                      <p style="line-height: 140%;"><strong>Adjunte también la descripción del Trabajo detallando costos de:</strong><br>
                                        - Materiales<br>
                                        - Mano de Obra<br>
                                        - Transporte<br>
                                        - Garantía<br><br><br>
                                        </p>
                                      <p style="line-height: 140%;">Por favor adjuntar: el certificado de RUC de sus actividades económicas, contacto o vendedor que realizó la cotización y contacto o persona que realizó la inspección.<br>
                                        En caso de no tener en stock el mencionado requerimiento, enviar un correo indicando la situación.<br><br><br>
                                        </p>
                                      <p style="line-height: 140%;">&nbsp;</p>
                                      <p style="line-height: 140%;">(593) 2524-530 | 128<br>

                                        jzuleta@malecon2000.org.ec<br>
                                        
                                        http://malecon2000.com/<br>
                                        
                                        Sargento Vargas # 116 y Av. Olmedo, Edificio Fundación Malecón 2000, Piso 1
                                        </p>
                                    </div>
      
                                  </td>
                                </tr>
                              </tbody>
                            </table>
      
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
      
      
      
      
      
                <div class="u-row-container" style="padding: 0px;background-color: transparent">
                  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 900px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #003399;">
                    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:900px;"><tr style="background-color: #003399;"><![endif]-->
      
                      <!--[if (mso)|(IE)]><td align="center" width="900" style="width: 900px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                      <div class="u-col u-col-100" style="max-width: 320px;min-width: 900px;display: table-cell;vertical-align: top;">
                        <div style="height: 100%;width: 100% !important;">
                          <!--[if (!mso)&(!IE)]><!-->
                          <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                            <!--<![endif]-->
      
                            <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                              <tbody>
                                <tr>
                                  <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
      
                                    <div style="font-size: 14px; color: #fafafa; line-height: 180%; text-align: center; word-wrap: break-word;">
                                      <p style="font-size: 14px; line-height: 180%;"><span style="font-size: 16px; line-height: 28.8px;">FUNDACIÓN MALECON 2000</span></p>
                                    </div>
      
                                  </td>
                                </tr>
                              </tbody>
                            </table>
      
                            <!--[if (!mso)&(!IE)]><!-->
                          </div>
                          <!--<![endif]-->
                        </div>
                      </div>
                      <!--[if (mso)|(IE)]></td><![endif]-->
                      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                    </div>
                  </div>
                </div>
      
      
      
                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
        <!--[if mso]></div><![endif]-->
        <!--[if IE]></div><![endif]-->
      </body>
      
      </html>`;
  }
/**
 * Recorre el arreglo  y eliminar los proveedores al momento de cancelar la solicitud
 */  
RecorrerPro(){
  let a= this.assignedProvs;
  a.forEach(element => {
    //console.log("elemento ",element.cotProvId);
    this.provCotService.deleteProvCot(element.cotProvId).subscribe({
      next: data => {
        //console.log('Eliminado con exito!');
        const msjExito="Solicitud Cancelada con exito";
        this.callMensaje(msjExito,true);
        this.getProvCotizacion();
      },
      error: error => {
        console.error('Error al Eliminar!', error);
      }
    })

  });


}
id_prov!: number;
setProvId(id: number){
  this.id_prov=id;
}

changeVerifyProv(){
  //console.log("id del provedor a verificar",this.id_prov);
  this.provCotService.verifyProveedor(this.id_prov).subscribe(
    response => {
      //console.log('Verificado con exito!');
      const msjExito="Proveedor verificado con exito";
      this.callMensaje(msjExito,true);
      setTimeout(() => {
        this.getProvCotizacion();
      }, 3000);
    },
    error => {
      console.error('Error al verificar!', error);
      const msjError="Error al verificar el proveedor";
      this.callMensaje(msjError,false);
    }
  );
}
callMensaje(mensaje: string, type: boolean){
  this.dialogService.openAlertDialog(mensaje, type);
}

}
