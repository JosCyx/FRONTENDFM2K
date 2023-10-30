import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//Services
import { TipoSolService } from 'src/app/services/comunicationAPI/solicitudes/tipo-sol.service';
import { CabCotizacionService } from 'src/app/services/comunicationAPI/solicitudes/cab-cotizacion.service';
import { AreasService } from 'src/app/services/comunicationAPI/seguridad/areas.service';
import { EmpleadosService } from 'src/app/services/comunicationAPI/seguridad/empleados.service';
import { NivelRuteoService } from 'src/app/services/comunicationAPI/seguridad/nivel-ruteo.service';
import { CabOrdCompraService } from 'src/app/services/comunicationAPI/solicitudes/cab-ord-compra.service';
import { CabPagoService } from 'src/app/services/comunicationAPI/solicitudes/cab-pago.service';


@Component({
  selector: 'app-solicitudes-no-aprobadas',
  templateUrl: './solicitudes-no-aprobadas.component.html',
  styleUrls: ['./solicitudes-no-aprobadas.component.css']
})
export class SolicitudesNoAprobadasComponent implements OnInit {
  AbierTipoSol: number = 0;
  //Observable de tipo de solicitud
  tipoSol: any[] = [];
  allSol: any[] = [];
  areaList: any[] = [];
  empleadoList: any[] = [];
  trckList: any[] = [];

  //Variables para condiciones
  isConsulta: boolean = false;
  isSolicitud: boolean = true;
  //Variables utilizar
  btp: number = 0;
  constructor(
    private router: Router,
    private tipoSolService: TipoSolService,
    private cabCotService: CabCotizacionService,
    private areaService: AreasService,
    private empService: EmpleadosService,
    private nivRuteoService: NivelRuteoService,
    private cabOCService: CabOrdCompraService,
    private cabPagoService: CabPagoService
  ) {}
  ngOnInit(): void {
    setTimeout(() => {
      
      this.tipoSolService.getTipoSolicitud().subscribe((data) => {
        this.tipoSol = data;
      });
      this.areaService.getAreaList().subscribe((data) => {
        this.areaList = data;
      });
      this.empService.getEmpleadosList().subscribe((data) => {
        this.empleadoList = data;
      });
      this.nivRuteoService.getNivelruteo().subscribe((data) => {
        this.trckList = data;
      });
    }, 200);
  }

    //Consultar solicitudes
    consultarSolicitudes(): void {
      this.btp = this.AbierTipoSol;
      this.isConsulta = true;
      if (this.AbierTipoSol == 1) {
        this.cabCotService.getAllCotizaciones().subscribe({
          next: (data) => {
            console.log('COTIZACIONES', data);
            this.allSol = data;
          },
          error: (error) => {
            console.error('Error', error);
          },
          complete: () => {
            console.log('subscribe finalizada correctamente');
          },
        });
      } else if (this.AbierTipoSol == 2) {
        this.cabOCService.getAllOrdenCmp().subscribe({
          next: (data) => {
            console.log('ORDENES DE COMPRA', data);
            this.allSol = data;
          },
          error: (error) => {
            console.error('Error', error);
          },
          complete: () => {
            console.log('subscribe finalizada correctamente');
          },
        });
      } else if (this.AbierTipoSol == 3) {
        this.cabPagoService.getAllPago().subscribe({
          next: (data) => {
            console.log('PAGOS', data);
            this.allSol = data;
          },
          error: (error) => {
            console.error('Error', error);
          },
          complete: () => {
            console.log('subscribe finalizada correctamente');
          },
        });
      }
    }
    //
    async selectSol(id: number) {
      if (this.AbierTipoSol == 1) {
        this.router.navigate(['solicoti']);
      } else if (this.AbierTipoSol == 2) {
        this.router.navigate(['solioc']);
      } else if (this.AbierTipoSol == 3) {
        this.router.navigate(['solipago']);
      }
    }

}
