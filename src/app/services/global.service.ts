import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GlobalService{
  //url de la API publicada
  APIUrl = "http://192.168.1.234:9193/api";

  //APIUrl = "https://localhost:7086/api";
  //api2: string = '';

  solView: string = 'crear';
  changePage: boolean = false; 
  solID: number = 0;
  setDestino: boolean = false;


  rutaJSON: string = '../../assets/configfm2k.json';
  configJSON: any = {};

  constructor(private http: HttpClient) {
    console.log("Servicio global corriendo...");
    this.http.get(this.rutaJSON).subscribe((data: any) => {
      this.configJSON = data;
      this.APIUrl = data.APIUrl;
      console.log("APIUrl:", this.APIUrl)
    });


  }

  
}
