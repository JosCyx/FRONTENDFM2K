import { Component, Input,OnInit } from '@angular/core';
import { UploadFileService } from 'src/app/services/comunicationAPI/solicitudes/upload-file.service';

@Component({
  selector: 'app-cot-documentacion',
  templateUrl: './cot-documentacion.component.html',
  styleUrls: ['./cot-documentacion.component.css'],
})
export class CotDocumentacionComponent  implements OnInit {
  //Variable de archivo
  // filesAll!:any;
  filesAll!: File;

  //variables compartidas
  @Input() tipoSol!: number;
  @Input() noSol!: number;
  public PDFview: string = '';
  //
  prefijo!: string;
  //Variable para Obtener el path
  paths: any[] = [];

  constructor(private uploadfile: UploadFileService) {}

  ngOnInit(): void {
    this.GetfileView();
  }
  imprimir() {
    this.prefijo = 'COT' + this.noSol + '-';
    console.log('Imprimir esto ', this.noSol, this.tipoSol, this.prefijo);
  }
  getFiles(event: any): void {
    // const [files]=$event.target.files;
    this.filesAll = event.target.files[0];
    console.log('Imprimir esto  Objetos de pdf ', this.filesAll);
  }

  sendfile(): void {
    const body = new FormData();
    this.prefijo = 'COT' + this.noSol + '-';
    body.append('archivos', this.filesAll);
    this.uploadfile
      .uploadFile(body, this.prefijo, this.tipoSol, this.noSol)
      .subscribe({
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

  GetfileView() {
    try {
      this.uploadfile.getFile(this.tipoSol,this.noSol).subscribe({
        next: (data) => {
          console.log('este es mi data', data);
          this.paths = data.map((a) => {
            return{
              docUrl:a.docUrl, 
            docNombre:a.docNombre
            }
            
          });
          console.log('este son mi pATH ', this.paths);
        },
        error(err) {
          console.error('Error al momento de obtener ', err);
        },
        complete: () => {
          console.log('Proceso completado');
        },
      });
    } catch (error) {
      console.log('Error en el proceso de GetfileView', error);
    } finally {
      console.log('FIN DEL  PROGRAMA');
    }
  }
}
