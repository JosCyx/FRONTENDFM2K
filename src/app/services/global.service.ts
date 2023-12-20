import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  //url de la API publicada
  //APIUrl = "http://192.168.1.234:9193/api";

  //APIUrl = "https://localhost:7086/api";
  APIUrl: string = '';
  //api2: string = '';

  solView: string = 'crear';
  changePage: boolean = false;
  solID: number = 0;
  //setDestino: boolean = false;
  tipoSolBsq: number = 1;
  currentPage: number = 1;

  rutaJSON: string = 'assets/configfm2k.json';
  configJSON: any = {};

  private configLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient) {
    console.log("Servicio global corriendo...");
    this.loadJson();
  }

  loadJson() {
    this.http.get(this.rutaJSON).toPromise()
      .then((data: any) => {
        this.configJSON = data;
        this.APIUrl = data.APIUrl;

        //setea el observable con la propiedad next para indicar que se ha resolvido la peticion correctamente
        this.configLoaded$.next(true);
        //console.log("APIUrl:", this.APIUrl)
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  getConfigLoadedObservable(): Observable<boolean> {
    return this.configLoaded$.asObservable();
  }

  getApiUrl(): string {
    return this.APIUrl;
  }

}
