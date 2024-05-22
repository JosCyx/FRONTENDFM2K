export class addProd{
  public APProducto:string;
  public APCodigo: string;
  public APUnidad:number;
  public APCategoria:number;
  public APObservaciones:string;
  public APImagen: string;
  
  
constructor(
  APProducto: string,
  APCodigo: string,
  APUnidad: number,
  APCategoria: number,
  APObservaciones: string,
  APImagen: string
  

){
  this.APProducto=APProducto;
  this.APCodigo=APCodigo;
  this.APUnidad=APUnidad;
  this.APCategoria=APCategoria;
  this.APObservaciones=APObservaciones;
  this.APImagen=APImagen;
    
}
}
