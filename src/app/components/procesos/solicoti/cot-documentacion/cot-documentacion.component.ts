import { Component,Input } from '@angular/core';
import { UploadFileService } from 'src/app/services/comunicationAPI/solicitudes/upload-file.service';

@Component({
  selector: 'app-cot-documentacion',
  templateUrl: './cot-documentacion.component.html',
  styleUrls: ['./cot-documentacion.component.css'],
})
export class CotDocumentacionComponent {
  //Variable de archivo
  filePDF: any;
  // filesAll!:any;
  filesAll!: File;
  
  //variables compartidas
  @Input() tipoSol: number=1;
  @Input() noSol!: number;
  
  prefijo: string = 'COT20-';
  constructor(private uploadfile: UploadFileService) {}
  getFiles(event: any): void {
    console.log('Imprimir esto ', event);
    // const [files]=$event.target.files;
    this.filesAll = event.target.files[0];
    console.log('Imprimir esto  de files ', this.filesAll);
    console.log('Imprimir esto  Objetos de pdf ', this.filesAll);
  }

  sendfile(): void {

      const body = new FormData();
      // body.append('file',this.filePDF.File, this.filePDF.FileName);
      body.append('archivos', this.filesAll);
      console.log('este es mi body', body);

      this.uploadfile.uploadFile(body,this.prefijo,1).subscribe({
        next: (data) => {
          console.log('este es mi data', data);
        },
        error: (error) => {
          console.error('este es mi error', error);
        },
        complete: () => {
          console.log('este es mi complete');
        },
      });
    
  }
}
