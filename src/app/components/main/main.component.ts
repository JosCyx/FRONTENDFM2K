import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UploadFileService } from 'src/app/services/comunicationAPI/solicitudes/upload-file.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  userName: string = this.cookieService.get('userName');

  appList: any[] = [];

  constructor(private globalService: GlobalService,
    private router: Router,
    private cookieService: CookieService,
    private documentService: UploadFileService,
    private dialogService: DialogServiceService
  ) { }

    
  ngOnInit(): void {
    this.globalService.currentPage = 0;
  }

  callMensaje(mensaje: string, type: boolean){
    this.dialogService.openAlertDialog(mensaje, type);
  }

  logOut() {
    this.cookieService.delete('authToken');
    this.cookieService.delete('userLogin');
    this.cookieService.delete('userIdNomina');
    this.cookieService.delete('userName');
    this.router.navigate(['login']);
    //console.log('Token vacio', this.cookieService.get('authToken'))

  }
  goRequests(): void {
    this.router.navigate(['mainconfig']);
  }

  goAdmin(): void {
    this.router.navigate(['mainsec']);
  }

  goNomina(){
    this.router.navigate(['mainnom']);
  }

  goComInt(){
    this.router.navigate(['maincomint']);
  }
  goInventario(){
    this.router.navigate(['visualizarInventario']);
    //consultar el grupo autorizado del usuario
    
  }

  goEventos(){
    this.router.navigate(['mainevento']);
  }

  goGestEventos(){
    this.router.navigate(['maineventogest']);
  }

  clearCookies() {
    const cookies = this.cookieService.getAll();

    for (const cookieName in cookies) {
      if (cookies.hasOwnProperty(cookieName)) {
        this.cookieService.delete(cookieName);
      }
    }
    //console.log(cookies);
  }

  getUserManual() {
    this.documentService.getSolManual().subscribe(
      (data) => {
        const file = new Blob([data], { type: 'application/pdf' });
        const urlfile = URL.createObjectURL(file);
        window.open(urlfile, '_blank');
      },
      (error) => {
        console.log('error', error);
      }
    );
  }

  manualString: string = '';
  showString(){
    this.manualString = 'Manual de Usuario'

    setTimeout(() => {
      this.manualString = ''
    }, 2000);
  }

}
