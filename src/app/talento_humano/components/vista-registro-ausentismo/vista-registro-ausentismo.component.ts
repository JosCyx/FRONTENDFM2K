import { Component, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-vista-registro-ausentismo',
  templateUrl: './vista-registro-ausentismo.component.html',
  styleUrls: ['./vista-registro-ausentismo.component.css']
})
export class VistaRegistroAusentismoComponent {
  @ViewChild('fileInput') fileInput: any;

  motivoAusName: string = '';
  observacionAus: string = '';

  usuarioName: string = this.cookieService.get('userName');
  fechaString: string = this.globalService.formatDateToSpanish(new Date());

  loading: boolean = true;

  selectedStartDate!: Date;
  selectedStartHour!: number;
  selectedStartMinutes!: number;

  selectedEndDate!: Date;
  selectedEndHour!: number;
  selectedEndMinutes!: number;

  validStartHour: boolean = true;
  validStartMinutes: boolean = true;
  validEndHour: boolean = true;
  validEndMinutes: boolean = true;

  documentList: { name: string, img: string, file?: File, ruta?: string}[] = [];
  motivoList: any[] = [];

  constructor(
    private cookieService: CookieService,
    private globalService: GlobalService,
    private dialogService: DialogServiceService
  ) { }

  ngOnInit() {
    this.loading = false;
  }

  getFinalDate(date: Date, hours: number, minutes: number): Date | null {
    if (!date) return null;

    const finalDate = new Date(date);
    finalDate.setHours(hours, minutes, 0, 0); // Set horas, minutos y segundos

    return finalDate;
  }


  verifyValidHour(type: number) {
    if (type === 1) {
      if (this.selectedStartHour < 0 || this.selectedStartHour > 23) {
        this.validStartHour = false;
        return;
      } else {
        this.validStartHour = true;
        return;
      }
    } else {
      if (this.selectedEndHour < 0 || this.selectedEndHour > 23) {
        this.validEndHour = false;
        return;
      } else {
        this.validEndHour = true;
        return;
      }
    }
  }

  verifyValidMinutes(type: number) {
    if (type === 1) {
      if (this.selectedStartMinutes < 0 || this.selectedStartMinutes > 59) {
        this.validStartMinutes = false;
        return;
      } else {
        this.validStartMinutes = true
        return;
      }
    } else {
      if (this.selectedEndMinutes < 0 || this.selectedEndMinutes > 59) {
        this.validEndMinutes = false;
        return;
      } else {
        this.validEndMinutes = true;
        return;
      }
    }
  }

  callMessage(message: string, type: boolean) {
    this.dialogService.openAlertDialog(message, type);
  }

  onFileSelected(event: any): void {
    if (this.documentList.length >= 5) {
      this.callMessage('No se pueden agregar más de 5 archivos.', false);
      return;
    }

    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword'];
      const maxSize = 5000 * 1024; // 5 MB

      if (!validTypes.includes(selectedFile.type)) {
        this.callMessage('El formato del archivo no está permitido.', false);
        return;
      }

      if (selectedFile.size > maxSize) {
        this.callMessage('El tamaño del archivo no debe exceder 5 MB.', false);
        return;
      }

      /*const reader = new FileReader();

      reader.onload = (e: any) => {
        this.documentList.push({ name: selectedFile.name, file: selectedFile});
        this.fileInput.nativeElement.value = '';
      };
      reader.readAsDataURL(selectedFile);*/

      let iconPath = '';

      if (selectedFile.type.includes('image')) {
        iconPath = 'assets/img/image.webp';
      } else if (selectedFile.type.includes('pdf')) {
        iconPath = 'assets/img/pdf.webp';
      } else if (selectedFile.type.includes('spreadsheet')) {
        iconPath = 'assets/img/excel.webp';
      } else if (selectedFile.type.includes('msword')) {
        iconPath = 'assets/img/doc.webp';
      } else if (selectedFile.type.includes('wordprocessingml')) {
        iconPath = 'assets/img/docx.webp';
      }
  
      // Agregar el archivo a la lista
      this.documentList.push({
        name: selectedFile.name,
        img: iconPath,
        file: selectedFile
      });
  
      // Limpiar el input
      this.fileInput.nativeElement.value = '';
    }
  }

  deleteFile(doc: string){
    const index = this.documentList.findIndex((docItem) => docItem.name === doc);
    this.documentList.splice(index, 1);
  }

  validarFormulario(): boolean {

    //validar que se haya ingresado una observacion
    if (!this.observacionAus) {
      this.callMessage('Debe ingresar una observación.', false);
      return false;
    }

    //validar que la shoras ingresadas sean correctas
    if(!this.validStartHour || !this.validStartMinutes || !this.validEndHour || !this.validEndMinutes){
      this.callMessage('Debe ingresar una hora y minutos válidos.', false);
      return false;
    }

    //vaidra que e hayan ingresado fechas
    if (!this.selectedStartDate || !this.selectedEndDate) {
      this.callMessage('Debe seleccionar una fecha de inicio y una fecha de fin.', false);
      return false;
    }


    return true;
  }

  triggerencio(){

  }

}
