import { Component, OnInit } from '@angular/core';
import { RolUsuarioService } from 'src/app/services/comunicationAPI/seguridad/rol-usuario.service';
import { RolesService } from 'src/app/services/comunicationAPI/seguridad/roles.service';
import { UsuariosService } from 'src/app/services/comunicationAPI/seguridad/usuarios.service';

interface Rol {
  RCodigo: number;
  RNombre: string;
  RCheck: boolean;
}
interface RolUsuar {
  ruEmpresa: number;
  ruRol: number;
  ruLogin: number;
  ruEstado: string;
}
@Component({
  selector: 'app-roles-users',
  templateUrl: './roles-users.component.html',
  styleUrls: ['./roles-users.component.css'],
})
export class RolesUsersComponent implements OnInit {
  changeview: string = 'consulta';
  isMensaje: boolean = true;
  currentPage: number = 1;

  // Rol y usuario rol
  usuariosign: number = 0;
  usuarioList: any[] = [];
  RolList: Rol[] = [];
  rolUsuario: RolUsuar[] = [];
  //para consultar
  rolAsignConsu: number = 0;
  rolConsuList: any[] = [];
  //
  idAuthDele: number =0;


  constructor(
    private rolService: RolesService,
    private usuarioservice: UsuariosService,
    private RolUsuarioservice: RolUsuarioService
  ) {}

  ngOnInit(): void {
    this.rolService.getRolsList().subscribe({
      next: (response) => {
        this.RolList = response.map((item: any) => {
          return {
            RCodigo: item.roCodigo,
            RNombre: item.roNombre,
            RCheck: false,
          };
        });
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
    this.usuarioservice.getUsuariosList().subscribe({
      next: (response) => {
        this.usuarioList = response;
        console.log('este es mi response ', this.usuarioList);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  //
  changeView(view: string) {
    this.changeview = view;
  }

  nextPage(): void {
    console.log('nextPage', this.currentPage);
    if (this.usuarioList.length <= 10) {
      console.log('nextPage', this.currentPage);
      this.currentPage = 1;
    } else if (this.currentPage >= this.usuarioList.length / 10) {
      this.currentPage = this.currentPage;
    } else {
      this.currentPage++;
    }
  }

  //decrementa el valor de la variable que controla la pagina actual que se muestra
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--; // Disminuir currentPage en uno si no está en la primera página
    }
  }
  seleccionarUsuario() {
    this.RolList.forEach((item) => {
      if (item.RCheck) {
        let RolU: RolUsuar = {
          ruEmpresa: 1,
          ruRol: item.RCodigo,
          ruLogin: this.usuariosign,
          ruEstado: 'A',
        };
        this.rolUsuario.push(RolU);
      }
    });
  }
  guardarAutorizacion() {
    this.rolUsuario.forEach((item) => {
      this.RolUsuarioservice.addRolUsuario(item).subscribe({
        next: (response) => {
          this.rolUsuario = [];
          this.RolList.forEach((item) => {
            item.RCheck = false;
          });
          this.usuariosign = 0;
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {},
      });
    });
  }

  Buscar() {
    this.isMensaje = false;
    console.log('este s mi this ', this.rolAsignConsu);
    this.RolUsuarioservice.getUsuarioNombrebyRol(this.rolAsignConsu).subscribe({
      next: (response) => {
        this.rolConsuList = response;
        console.log('esto es mi response ', this.rolConsuList);
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {},
    });
  }

  //
  selectIdDelete(id: number) {
    this.idAuthDele = id;
  }
  eliminarAutorizacion(){
    this.RolUsuarioservice.deleteRolUsuario(this.idAuthDele).subscribe({
      next: (response) => {
        this.rolAsignConsu=0;
        this.rolConsuList=[];
      },
      error: (error) => {
        console.error(error);
      },
    })
  }
}
