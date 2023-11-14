import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { AppAuthorizeTransactionDirective } from 'src/app/directives/app-authorize-transaction.directive';
import { UploadFileService } from 'src/app/services/comunicationAPI/solicitudes/upload-file.service';
import { DialogServiceService } from 'src/app/services/dialog-service.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  userName: string = this.cookieService.get('userName');

  constructor(private globalService: GlobalService,
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService,
    private documentService: UploadFileService,
    private dialogService: DialogServiceService) { }

    
  ngOnInit(): void {

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
    this.documentService.getUserManual().subscribe(
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
