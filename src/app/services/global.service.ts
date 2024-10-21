import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

interface DIM {
  dimPresupuesto: number,
  dimSubAct: number,
  /*dimAct: number,
  dimSect: number,
  dimProyecto: number*/
}

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
  currentPage: number = 0;

  rutaJSON: string = 'assets/configfm2k.json';
  configJSON: any = {};

  loadingSolicitud: boolean = false;

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

  //DIMENSIONES DE LA SOLICITUD
  solDimensiones: DIM = {
    dimPresupuesto: 57,
    dimSubAct: 158,
    /*dimAct: 91,
    dimSect: 56,
    dimProyecto: 7*/
  }

  solIfProyecto: number = 0;

  solValor: number = 0;
  solOC: string = "";
  solEstado: number = 10;

  isDimSetted: boolean = false;

  hasSolDimensiones(): boolean {
    //si la solicitud esta en estado 50 (Proceso de compras), se debe verificar que esten todas las dimensiones
    if (this.solEstado == 50) {
      return this.solDimensiones.dimPresupuesto != 57 &&
        this.solDimensiones.dimSubAct != 158
      /*&& this.solDimensiones.dimAct != 91 && 
      this.solDimensiones.dimSect != 56 && 
      this.solDimensiones.dimProyecto != 7;*/
    } else {
      return this.solDimensiones.dimPresupuesto != 57
      /* && this.solDimensiones.dimSect != 56 && 
       this.solDimensiones.dimProyecto != 7;*/
    }
  }

  clearSolDimensiones() {
    console.log("Limpiando dimensiones...");
    this.solDimensiones = {
      dimPresupuesto: 57,
      dimSubAct: 158,
      /*dimAct: 91,
      dimSect: 56,
      dimProyecto: 7*/
    }
  }

}
