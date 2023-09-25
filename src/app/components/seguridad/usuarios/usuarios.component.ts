import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuariosService } from 'src/app/services/comunicationAPI/seguridad/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  user: string = '';
  pass: string = '';
  nombre: string = '';
  estado: string = '';
  fechaInicio: Date = new Date;
  fechaFin: Date = new Date;

  confirmPass: string = '';
  changeview: string = 'consulta'; 
  currentPage: number = 1;
  

  userList$!: Observable<any[]>;
  listUsers: any[] = [];

  constructor(private usuarioService: UsuariosService) { }

  ngOnInit(): void {
    //llama los datos de los usuarios desde la api
    this.userList$ = this.usuarioService.getUsuariosList();

    //guarda los usuarios en una lista local para un manejo mas sencillo
    this.userList$.subscribe(
      (data) => {
        this.listUsers = data;
      }
    );

  }

  agregarUsuario(){
    const usuario: any = {
      user: this.user,
      pass: this.pass,
      nombre: this.nombre,
      estado: this.estado,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin
    }


    this.usuarioService.addNewUsuario(usuario).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
  
    //resetea las variables para que no muestren contenido en la vista
    this.user = '';
    this.pass = '';
    this.nombre = '';
    this.estado = '';
    this.fechaInicio = new Date;
    this.fechaFin = new Date;

    //regresa a la vista consulta donde se muestran todos los roles
    this.changeview= 'consulta';
  }

  clear(): void {
    this.user = '';
    this.pass = '';
    this.nombre = '';
    this.estado = '';
    this.fechaInicio = new Date;
    this.fechaFin = new Date;
  }

  //controla la vista de las diferentes partes
  changeView(view: string): void {
    this.clear();
    
    this.changeview = view;
  }

  //resetea las variables a valores vacios y cambia la variable de vista para mostrar la lista de roles 
  cancelar():void{
    this.user = '';
    this.pass = '';
    this.nombre = '';
    this.estado = '';

    this.changeview = 'consulta';

  }
}

//[disabled]="!edicion"