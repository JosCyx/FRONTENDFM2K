export class Usuario{
    user: string;
    pass: string;
    nombre: string;
    estado: string;
    fechaInicio: Date;
    fechaFin: Date;

    constructor(user: string,pass: string,nombre: string,estado: string,fechaInicio: Date,fechaFin: Date){
        this.user = user;
        this.pass = pass;
        this.nombre = nombre;
        this.estado = estado;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
    }
}