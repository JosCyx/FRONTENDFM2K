import { Component,Input } from '@angular/core';
import { UploadFileService } from 'src/app/services/comunicationAPI/solicitudes/upload-file.service';


@Component({
  selector: 'app-sp-documentacion',
  templateUrl: './sp-documentacion.component.html',
  styleUrls: ['./sp-documentacion.component.css']
})
export class SPDocumentacionComponent {
   //* Variables de archivo
   filesAll!: File;
   //* Variables compartidas
   @Input() tipoSol!: number;
   @Input() noSol!: number;
   //
   prefijo!: string ;

  constructor(private uploadfile: UploadFileService) {}
  getFiles(event: any): void {
    console.log('Imprimir esto ', event);
    // const [files]=$event.target.files;
    this.filesAll = event.target.files[0];
    console.log('Imprimir esto  Objetos de pdf ', this.filesAll);
  }
  //Enviar archivos al servidor y guardar a  la base
  sendfile(): void {
    const body = new FormData();
    this.prefijo='SP'+this.noSol+'-';
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
