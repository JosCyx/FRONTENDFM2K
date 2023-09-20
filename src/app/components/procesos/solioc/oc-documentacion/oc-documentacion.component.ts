import { Component,Input } from '@angular/core';
import { UploadFileService } from 'src/app/services/comunicationAPI/solicitudes/upload-file.service';


@Component({
  selector: 'app-oc-documentacion',
  templateUrl: './oc-documentacion.component.html',
  styleUrls: ['./oc-documentacion.component.css']
})
export class OCDocumentacionComponent {
  //* Variables de archivo
  filesAll!: File;
  //* Variables compartidas
  @Input() tipoSol!: number;
  @Input() noSol!: number;
  //
  prefijo!:string;
  constructor(private uploadfile: UploadFileService) {}
  //Obtener archivos
  getFiles(event: any): void {
    console.log('Imprimir esto ', event);
    // const [files]=$event.target.files;
    this.filesAll = event.target.files[0];
    console.log('Imprimir esto  Objetos de pdf ', this.filesAll);
  }
  //Enviar archivos al servidor y guardar a  la base
  sendfile(): void {
    const body = new FormData();
    this.prefijo='OC'+this.noSol+'-';
    body.append('archivos', this.filesAll);
    this.uploadfile.uploadFile(body,this.prefijo,this.tipoSol,this.noSol).subscribe({
      next: (data) => {
        console.log('este es mi data', data);
      },
      error: (error) => {
        console.error('este es mi error', error);
      },
      complete: () => {
        console.log('Proceso completado');
      },
    });
}

}
