import { TimeInterval } from 'rxjs/internal/operators/timeInterval';

export class PermisosVarios {
  public PVFecha: Date;
  public PVHora: string ;
  public PVSector: string;
  public PVTipoActv: string;
  public PVRefLug: string;
  public PVAsunto: string;
  public PVCantPersMax: number;
  public PVEmpresa: string;
  public PVTelefono: string;
  public PVCorreo: string;
  public PVCedula: string;
  public PVRespRec: string;
  public PVARefLug: string;


  constructor(
    PVFecha: Date,
    PVHora: string,
    PVSector: string,
    PVTipoActv: string,
    PVRefLug: string,
    PVAsunto: string,
    PVCantPersMax: number,
    PVEmpresa: string,
    PVTelefono: string,
    PVCorreo: string,
    PVCedula: string,
    PVRespRec: string,
    PVARefLug: string

    
  ){

    this.PVFecha = PVFecha;
    this.PVHora = PVHora; 
    this.PVSector= PVSector;
    this.PVTipoActv= PVTipoActv;
    this.PVRefLug= PVRefLug;
    this.PVAsunto= PVAsunto;
    this.PVCantPersMax = PVCantPersMax;
    this.PVEmpresa= PVEmpresa;
    this.PVTelefono= PVTelefono;
    this.PVCorreo=PVCorreo;
    this.PVCedula= PVCedula;
    this.PVRespRec= PVRespRec;
    this.PVARefLug= PVARefLug
  }
  
}
