import { Component } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UploadFileService } from 'src/app/services/comunicationAPI/solicitudes/upload-file.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  userName: string = this.cookieService.get('userName');
  isLogin: boolean = false;
  showSB: boolean = false;

  constructor(
    private globalService: GlobalService,
    private router: Router,
    private cookieService: CookieService,
    private documentService: UploadFileService
  ) {}

  isSidebarVisible = false;

  toggleSidebar() {
    this.showSB = !this.showSB;
    //this.isSidebarVisible = !this.isSidebarVisible;
  }

  backToMain(): void {
    //this.globalService.toggleAppSelected();
    //this.globalService.appSelected = false;

    this.router.navigate(['main']);
  }

  //destruye la cookie
  logOut() {
    this.cookieService.delete('authToken');
    this.cookieService.delete('userLogin');
    this.cookieService.delete('userIdNomina');
    this.cookieService.delete('userName');
    this.cookieService.delete('userTransactions');
    this.cookieService.delete('userRoles');
    this.cookieService.delete('userArea');
    this.router.navigate(['login']);
    //console.log('Token vacio', this.cookieService.get('authToken'))
  }

  routToCot() {
    this.globalService.solView = 'crear';
    this.router.navigate(['allrequest']);

    setTimeout(() => {
      this.router.navigate(['solicoti']);
    }, 1);
  }

  routToOC() {
    this.globalService.solView = 'crear';
    this.router.navigate(['allrequest']);

    setTimeout(() => {
      this.router.navigate(['solioc']);
    }, 1);
  }

  routToPago() {
    this.globalService.solView = 'crear';
    this.router.navigate(['allrequest']);

    setTimeout(() => {
      this.router.navigate(['solipago']);
    }, 1);
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
