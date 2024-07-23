import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { co } from '@fullcalendar/core/internal-common';
import { CookieOptions, CookieService } from 'ngx-cookie-service';
import { GeneralControllerService } from 'src/app/services/comunicationAPI/inventario/general-controller.service';
import { MovimientosControllerService } from 'src/app/services/comunicationAPI/inventario/movimientos-controller.service';
import { ProductoControllerService } from 'src/app/services/comunicationAPI/inventario/producto-controller.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { GlobalInventarioService } from 'src/app/services/global-inventario.service';
import { GlobalService } from 'src/app/services/global.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-registrar-movimiento',
  templateUrl: './registrar-movimiento.component.html',
  styleUrls: ['./registrar-movimiento.component.css']
})
export class RegistrarMovimientoComponent {

  movimiento: any = {
    tipo_mov: 1,
    proveedor: ' ',
    tras_sector: this.globalInvService.sectorSelected,
    emp_destino: '',
    precio_unit: 0.1,
    cantidad: 1,
    observ: ' ',
    sol_asoc: ''
  };

  fecha: string = this.globalInvService.formatDateToYYYYMMDD(new Date());

  tipoMovimientoList: any[] = []

  destinatariosData: any = {};
  destinatariosList: any[] = [];

  destinatariosListFiltered: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<RegistrarMovimientoComponent>,
    private dialogService: DialogServiceService,
    private generalService: GeneralControllerService,
    public globalInvService: GlobalInventarioService,
    public cookieService: CookieService,
    private movService: MovimientosControllerService
  ) { }

  ngOnInit(): void {
    this.generalService.getGeneralData(2, 0).subscribe(
      (data) => {
        //console.log(data);
        this.tipoMovimientoList = data;
      },
      (error) => {
        console.error(error);
      }
    );

    this.movService.getDestByGroup(this.globalInvService.sectorSelected).subscribe(
      (data) => {
        console.log("lista de destinatarios", data);
        this.destinatariosData = data;
        this.destinatariosList = _.cloneDeep(data.datos); 
        this.destinatariosListFiltered = _.cloneDeep(data.datos);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  cancelarMov() {
    this.dialogRef.close();
  }

  changeTipoMov() {
    this.movimiento.precio_unit = 0.1;
    this.movimiento.proveedor = '';
    this.movimiento.tras_sector = this.globalInvService.sectorSelected;
  }

  registrarMovimiento() {
    if (this.movimiento.cantidad <= 0) {
      this.callMensaje("La cantidad debe ser como mínimo 1", false);
      return;

    }

    if (this.destinatariosData.idDestinatario == 2 && this.movimiento.emp_destino == '000000') {
      this.callMensaje("Debe seleccionar un empleado destino", false);
      return;
    }

    var precio_unit = 0;
    var precio_total = 0;
    if (this.movimiento.tipo_mov == 1) {
      precio_unit = this.movimiento.precio_unit;
      precio_total = this.movimiento.precio_unit * this.movimiento.cantidad;
    }

    const now = new Date();
    const localDate = new Date(now.getTime() - (5 * 60 * 60 * 1000));

    const data = {
      movProducto: this.globalInvService.productSelectedID,
      movSector: this.globalInvService.sectorSelected,
      movTipoMov: this.movimiento.tipo_mov,
      movPrecioUnit: precio_unit,
      movProveedor: this.movimiento.proveedor,
      movPrecioTotal: precio_total,
      movFecha: localDate,
      movCantidad: this.movimiento.cantidad,
      movSectorDestino: this.movimiento.tras_sector,
      movAutor: this.cookieService.get('userName'),
      movObservaciones: this.movimiento.observ,
      movSolAsoc: this.movimiento.sol_asoc,
      movEmpleadoDestino: this.searchDestinatarioId(this.movimiento.emp_destino).toString().padStart(6, '0')
    }

    //console.log("movimiento nuevo:", data);

    this.movService.insertMovimiento(data).subscribe(
      (data) => {
        if (data == 90) {
          this.callMensaje("El stock de producto es 0, debe realizar un ingreso antes de poder realizar un egreso.", false);
          return;
        } else if (data == 91) {
          this.callMensaje("El stock de producto es menor a la cantidad solicitada, no se puede realizar el egreso.", false);
          return;
        } else {
          console.log(data);
          this.globalInvService.setConfirmObserv(true);
          this.dialogRef.close();
          this.callMensaje("Movimiento registrado con exito", true);
        }
      },
      (error) => {
        console.error(error);
        this.callMensaje("Error al registrar el movimiento", false);
      }
    );
  }

  callMensaje(mensaje: string, type: boolean) {
    this.dialogService.openAlertDialog(mensaje, type);
  }

  filterList(event: any){
    this.applyFilter(event.target.value);
  }

  applyFilter(valor: string){
    this.destinatariosListFiltered = this.destinatariosList.filter(emp => emp.nombre.toLowerCase().includes(valor.toLowerCase())    
    );
  }

  searchDestinatarioId(nombre: string): number{
    const empleado = this.destinatariosList.find(emp => emp.nombre == nombre);
    return empleado.codigo;
  }

  console(){
    console.log(this.movimiento.emp_destino);
    console.log(this.searchDestinatarioId(this.movimiento.emp_destino));
  }
}
