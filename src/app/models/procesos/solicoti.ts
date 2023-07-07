export class Solicoti{
    fecha: Date;
    sector: string;
    asunto:string;
    nrosoli: string;
    solicitadopor: string;

    constructor(fecha: Date, sector: string, asunto:string, nrosoli: string, solicitadopor: string){
        this.fecha = fecha;
        this.sector = sector;
        this.asunto = asunto;
        this.nrosoli = nrosoli;
        this.solicitadopor = solicitadopor;
    }

}