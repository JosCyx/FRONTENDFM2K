import { Component } from '@angular/core';
import { AusentismosService } from 'src/app/services/comunicationAPI/tthh/ausentismos.service';

@Component({
  selector: 'app-vista-admin-motivos',
  templateUrl: './vista-admin-motivos.component.html',
  styleUrls: ['./vista-admin-motivos.component.css']
})
export class VistaAdminMotivosComponent {
  motId: number = 0;
  estado: number = 0;
  motivo: string = '';
  document: number = 0;
  maxDias: number = 0;

  //VARIABLE USADA PARA CONTROLAR FUNCIONES DE LA PAGINA
  changeview: string = 'consulta';
  mensajeExito: string = '';
  msjError: string = '';
  showmsj: boolean = false;
  showmsjerror: boolean = false;
  currentPage: number = 1;

  //LISTAS
  motivoList: any[] = [];

  constructor(private ausentismoService: AusentismosService) { }

  //controla la vista de las diferentes partes
  changeView(view: string): void {
    //vacía las variables antes de cambiar de vista para que no muestren datos
    this.motivo = '';
    this.document = 0;
    this.estado = 0;
    this.maxDias = 0;
    this.changeview = view;

  }
  ngOnInit() {
    setTimeout(() => {
      this.ausentismoService.getMotivosAus().subscribe({
        next: (motivos: any[]) => {
          this.motivoList = motivos
          console.log("motivos", this.motivoList);
        },
        error: (err) => {
          console.log("error", err)
        }
      });
    }, 100);
  }


  guardarMotivo() {
    const data = {
      motDescripcion: this.motivo,
      motIfDocument: this.document,
      motEstado: this.estado,
      motMaxDias: this.maxDias // Se corrigió el nombre de la propiedad
    };

    this.ausentismoService.postMotivoAus(data).subscribe(
      response => {
        // Manejar la respuesta de la API aquí si es necesario
        this.showmsj = true;
        this.mensajeExito = 'Motivo registrado exitosamente.';
        setTimeout(() => {
          this.showmsj = false;
          this.mensajeExito = '';
          this.showmsjerror = false;
          this.msjError = '';
          this.changeview = 'consulta';
          this.ngOnInit();
        }, 3000);

      },
      error => {
        // Manejar cualquier error que ocurra durante la llamada a la API aquí
        console.error('Error al agregar el motivo:', error);
        this.showmsjerror = true;
        this.msjError = "Error al agregar el motivo";
      }
    );
  }

  cancelar(): void {
    this.motivo = '';
    this.document = 0;
    this.estado = 0;
    this.maxDias = 0;
    this.changeview = 'consulta';
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      console.log("prevPage", this.currentPage);
      this.currentPage--; // Disminuir currentPage en uno si no está en la primera página
    }
  }
  nextPage(): void {
    console.log("nextPage", this.currentPage);
    if (this.motivoList.length <= 10) {
      this.currentPage = 1;
    } else if (this.currentPage >= this.motivoList.length / 10) {
      this.currentPage = this.currentPage;
    } else {
      this.currentPage++
    }
  }

  editarMotivo(motivo: any): void {
    // Asignar los valores del rol obtenido a las variables locales
    console.log("motivo", motivo)
    this.motId = motivo.motId;
    this.motivo = motivo.motDescripcion;
    this.estado = motivo.motEstado;
    this.document = motivo.motIfDocument;
    this.maxDias = motivo.motMaxDias;
    // Cambiar la variable de vista para mostrar la pantalla de edición
    this.changeview = 'editar';
  }

  guardarEdicion(): void {
    const data = {
      motId: this.motId,
      motDescripcion: this.motivo,
      motIfDocument: this.document,
      motEstado: this.estado,
      motMaxDias: this.maxDias 
    };
    console.log("edit", data)
    this.ausentismoService.updateMotivoAus(this.motId, data).subscribe(
      response => {
        // Manejar la respuesta de la API aquí si es necesario
        
        console.log('Rol actualizado exitosamente:', response);
        this.showmsj = true;
        this.mensajeExito = "Edicion exitosa";

      },
      error => {
        // Manejar cualquier error que ocurra durante la llamada a la API aquí
        console.error('Error al actualizar el rol:', error);
        this.showmsjerror = true;
        this.msjError = "Error al editar";
      }
    );
    setTimeout(() => {
      // Restablecer las variables locales a sus valores iniciales
      this.motivo = '';
      this.document = 0;
      this.estado = 0;
      this.maxDias = 0;
      this.mensajeExito = '';
      this.showmsj = false;
      this.showmsjerror = false;
      this.msjError = '';
      this.changeview = 'consulta';
      this.ngOnInit();
    }, 3000);
  }
}
