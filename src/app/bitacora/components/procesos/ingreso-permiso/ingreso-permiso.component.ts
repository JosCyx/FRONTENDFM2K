import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { values } from 'lodash';
import { CookieService } from 'ngx-cookie-service';
import { PermisoSI } from 'src/app/bitacora/models/permisoSI';
import { PermisoSIService } from 'src/app/services/comunicationAPI/Bitacora/permiso-si.service';
import { DepartamentosService } from 'src/app/services/comunicationAPI/seguridad/departamentos.service';
import { PermisotrabajoService } from 'src/app/services/comunicationAPI/Bitacora/permisotrabajo.service';
@Component({
  selector: 'app-ingreso-permiso',
  templateUrl: './ingreso-permiso.component.html',
  styleUrls: ['./ingreso-permiso.component.css'],
})
export class IngresoPermisoComponent {
  fechainicio: Date = new Date();
  isnaturalperson: boolean = false;
  panelOpenState: boolean = false;

  @ViewChild('fileInput')
  fileInput: any;

  actaCompromiso!: {
    file: File;
    url: string;
    nombre: string;
  };
  nombreempleado: string = this.cookieservice.get('userName');
  nombredepartamento: string=this.cookieservice.get('usNameDep')
  isactaCompromiso: boolean = false;


  trabajos = this._formBuilder.group({
    tcomunes: false,
    metalmecanicas: false,
    fumigacion: false,
    soldadura: false,
    carpinteriapintura: false,
    taltura: false,
    ttension: false,
    econfinados: false,
    telecomunicaciones: false,
  });
  permisoSI: PermisoSI = {
    PSINomActv: '',
    PSIFinicio: new Date(),
    PSIFfinal: new Date(),
    PSIProvRec: undefined,
    PSIDescripcion: '',
    PSIUbicacion: '',
    PSINomProv: '',
    PSINomResp: '',
    PSIPersNat: '',
    PSIRuc: '',
    PSICorreo: '',
    PSITelefono: '',
    PSICantPersMax: 1,
  };

  constructor(
    private _formBuilder: FormBuilder,
    private cookieservice: CookieService,
    private departamentoservice: DepartamentosService,
    private permisoSIService: PermisoSIService
  ) {}
  ngOnInit(): void {
    console.log(this.fechainicio, 'fecha de inicio');
   
  }
  onFileSelected(event: any): void {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.actaCompromiso = {
          file: selectedFile,
          url: e.target.result,
          nombre: selectedFile.name,
        };

        this.fileInput.nativeElement.value = '';

        this.isactaCompromiso = true;
      };

      reader.readAsDataURL(selectedFile);
    }
  }
  deleteImage() {
    this.actaCompromiso = { file: new File([], ''), url: '', nombre: '' };
    this.isactaCompromiso = false;
    this.fileInput.nativeElement.value = '';
  }
  nummax() {
    console.log(this.permisoSI.PSICantPersMax);
    if (this.permisoSI.PSICantPersMax > 30) {
      setTimeout(() => {
        this.permisoSI.PSICantPersMax = 30;
      }, 1);
    }
  }
  limpiar() {
    this.permisoSI = {
      PSINomActv: '',
      PSIFinicio: new Date(),
      PSIFfinal: new Date(),
      PSIProvRec: undefined,
      PSIDescripcion: '',
      PSIUbicacion: '',
      PSINomProv: '',
      PSINomResp: '',
      PSIPersNat: '',
      PSIRuc: '',
      PSICorreo: '',
      PSITelefono: '',
      PSICantPersMax: 1,
    };
    this.panelOpenState = false;
    this.trabajos.reset();

  }

  postPermisoSI0(){
    const permiso={
    psiTpPermiso: 1,
    psiSolicitante: "string",
    psiDepartamento: 0,
    psiNomActv: "string",
    psiFechaInicio: "2024-04-25",
    psiFechaFin: "2024-04-25",
    psiProvRecurrente: 0,
    psiDescripcionActv: "string",
    psiProveedor: "string",
    psiResponsableProv: "string",
    psiPersonaNat: "string",
    psiRucPersonaNat: "string",
    psiCorreo: "string",
    psiTelefono: "string",
    psiCantPersonas: 0,
    psiTpFormSi: 1,
    }
  }
  // getDepartamentName(idDep: number) {
  //   const dep = this.departamentolist.find((dep) => dep.depIdNomina == idDep);

  //   return;
  //   dep ? dep.depDescp : 'Departamento desconocido';
  // }
}
