import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { GlobalService } from '../../global.service';
import { NivelRuteoService } from '../seguridad/nivel-ruteo.service';

@Injectable({
  providedIn: 'root'
})
export class SolTimeService {
  APIUrl = this.globalService.APIUrl;
  nivelesRuteo: any[] = [];

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private globalService: GlobalService,
    private nivelRuteo: NivelRuteoService
  ) {
    this.globalService.getConfigLoadedObservable().subscribe(
      (configLoaded) => {
        if (configLoaded) {
          this.APIUrl = this.globalService.getApiUrl();
          //console.log("Url impresa:", this.APIUrl);
          // Ahora puedes usar apiUrl de manera segura.
        }
      }
    );


    // Buscar el nombre del nivel de ruteo según el nivel traido como parámetro
    this.nivelRuteo.getNivelruteo().subscribe(
      (response) => {
        //console.log("Niveles:", response);
        this.nivelesRuteo = response;
      },
      (error) => {
        console.log("Error al obtener el nombre del nivel de ruteo:", error);
      }
    );

  }

  private getHeadersWithAuthToken(): HttpHeaders {
    // Obtiene el token de la cookie
    const authToken = this.cookieService.get('authToken');

    // Define las cabeceras de la solicitud con el token
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });
  }

  saveSolTime(tipoSol: number, noSol: number, id_emp: string, name_emp: string, nivel: number) {
    let nivel_name = '';

    //buscar el nivel cuando coincida con el parametro nivel usando find()
    const nivelEncontrado = this.nivelesRuteo.find(n => n.nivel === nivel);
    nivel_name = nivelEncontrado.descRuteo;
    
    // Obtener la fecha y la hora local en tu zona horaria
    const fechaLocal = new Date();

    const horaLocal = fechaLocal.toTimeString();
    const horaFormateada = horaLocal.replace(" GMT-0500 (hora de Ecuador)", "")

    fechaLocal.setHours(fechaLocal.getHours() - 5);


    // Crear el objeto de datos con la fecha y hora locales
    const data = {
      solTmTipoSol: tipoSol,
      solTmNoSol: noSol,
      solTmIdEmpleado: id_emp,
      solTmNameEmpleado: name_emp,
      solTmNivelRuteo: nivel,
      solTmNameRuteo: nivel_name,
      solTmFecha: fechaLocal,
      solTmHora: horaFormateada
    };

    // Enviar los datos al servidor
    //console.log("Datos a enviar:", data);
    this.postSolTime(data).subscribe(
      (response) => {
        console.log("Respuesta de la API:", response);
      },
      (error) => {
        console.log("Error al guardar el tiempo de solicitud:", error);
      }
    );
  }



  postSolTime(data: any) {
    const headers = this.getHeadersWithAuthToken();
    return this.http.post(this.APIUrl + '/SolicitudesTimes', data, { headers: headers });
  }
}
