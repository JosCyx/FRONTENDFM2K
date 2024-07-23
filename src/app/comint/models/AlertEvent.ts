import { ProgramAlert } from "./ProgramAlert";

export class AlertEvent{
    public altEvId?: number;
    public altEvTipoAlerta: number;
    public altEvTituloAlerta: string;
    public altEvImagenAlerta: string;
    public altEvLugar: string;
    public altEvEstado: number;
    public altEvEstadoEvento: number;
    public altEvFechaEvento: string;
    public altEvHoraEvento: string;
    public altEvProgramacion?: ProgramAlert[] = [];

    public empleadoName?: string;
    public idImage?: number;

    constructor(
        altEvTipoAlerta: number,
        altEvTituloAlerta: string,
        altEvImagenAlerta: string,
        altEvLugar: string,
        altEvEstado: number,
        altEvEstadoEvento: number,
        altEvFechaEvento: string,
        altEvHoraEvento: string
    ){
        this.altEvTipoAlerta = altEvTipoAlerta;
        this.altEvTituloAlerta = altEvTituloAlerta;
        this.altEvImagenAlerta = altEvImagenAlerta;
        this.altEvLugar = altEvLugar;
        this.altEvEstado = altEvEstado;
        this.altEvEstadoEvento = altEvEstadoEvento;
        this.altEvFechaEvento = altEvFechaEvento;
        this.altEvHoraEvento = altEvHoraEvento;
    }
}