export class Documento{
    clave: number;
    descripcion: string;
    estado: string;
    constructor(clave: number, descripcion: string, estado: string) {
     this.clave = clave;
     this.descripcion = descripcion;
     this.estado = estado;   
    }

}