export class Rol{
    codigo: string;
    nombre: string;
    aplicacion:string;
    estado: string;

    constructor(codigo: string, nombre: string, aplicacion:string, estado: string){
        this.codigo = codigo;
        this.nombre = nombre;
        this.aplicacion = aplicacion;
        this.estado = estado;
    }

}