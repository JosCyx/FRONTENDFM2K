export class PermisoSI{
  public PSINomActv:string;
  public PSIFinicio:Date;
  public PSIFfinal:Date;
  public PSIProvRec:boolean|undefined;
  public PSIDescripcion: string;
  public PSIUbicacion: string;
  public PSINomProv:string;
  public PSINomResp:string;
  public PSIPersNat:string;
  public PSIRuc:string;
  public PSICorreo:string;
  public PSITelefono:string;
  public PSICantPersMax:number;
  
constructor(
  PSINomActv: string,
  PSIFinicio: Date,
  PSIFfinal:Date,
  PSIProvRec: boolean|undefined,
  PSIDescripcion:string,
  PSIUbicacion:string,
  PSINomProv:string,
  PSINomResp:string,
  PSIPersNat:string,
  PSIRuc:string,
  PSICorreo:string,
  PSITelefono:string,
  PSICantPersMax:number,


){
  this.PSINomActv=PSINomActv;
  this.PSIFinicio=PSIFinicio;
  this.PSIFfinal=PSIFfinal;
  this.PSIProvRec=PSIProvRec;
  this.PSIDescripcion=PSIDescripcion;
  this.PSIUbicacion=PSIUbicacion;
  this.PSINomProv=PSINomProv;
  this.PSINomResp=PSINomResp;
  this.PSIPersNat=PSIPersNat;
  this.PSIRuc=PSIRuc;
  this.PSICorreo=PSICorreo;
  this.PSITelefono=PSITelefono;
  this.PSICantPersMax=PSICantPersMax;
}
}
