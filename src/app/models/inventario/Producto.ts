export class Producto{
  public nombre:string;
  public descripcion?:string;
  public unidad:number;
  public categoria:number;
  public observ?:string;
  public imagen?: string;
  
  
constructor(
  nombre: string,
  descripcion: string,
  unidad: number,
  categoria: number,
  observ: string,
  imagen: string
  

){
  this.nombre=nombre;
  this.descripcion=descripcion;
  this.unidad=unidad;
  this.categoria=categoria;
  this.observ=observ;
  this.imagen=imagen;
    
}
}
