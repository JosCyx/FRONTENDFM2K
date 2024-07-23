export class ProgramAlert{  
    public prAltId?: number;
    public prAltIdAlerta: number;
    public prAltFecha: string;
    public prAltHora: string;
    public prAltEstado: number;

    constructor(
        prAltIdAlerta: number,
        prAltFecha: string,
        prAltHora: string,
        prAltEstado: number
    ){
        this.prAltIdAlerta = prAltIdAlerta;
        this.prAltFecha = prAltFecha;
        this.prAltHora = prAltHora;
        this.prAltEstado = prAltEstado;  
    }
}