export class SolicitudEvento {

    public solEvId?: number;
    public solEvIdSolicitante: string;
    public solEvIdAreaSolicitante: number;
    public solEvDepSolicitante: number;
    public solEvIdTipoAct: number;
    public solEvFechaInicio: string;
    public solEvFechaFin: string;
    public solEvAsuntoEvento: string;
    public solEvDetalleEvento: string;
    public solEvHoraInicio: string;
    public solEvHoraFin: string;
    public solEvLugarEvento: string;
    public solEvEstadoEvento: number;
    public solEvEstado: number;
    public empleadoName?: string;

    constructor(
        solEvIdSolicitante: string,
        solEvIdAreaSolicitante: number,
        solEvDepSolicitante: number,
        solEvIdTipoAct: number,
        solEvFechaInicio: string,
        solEvFechaFin: string,
        solEvAsuntoEvento: string,
        solEvDetalleEvento: string,
        solEvHoraInicio: string,
        solEvHoraFin: string,
        solEvLugarEvento: string,
        solEvEstadoEvento: number,
        solEvEstado: number
    ) {
        this.solEvIdSolicitante = solEvIdSolicitante;
        this.solEvIdAreaSolicitante = solEvIdAreaSolicitante;
        this.solEvDepSolicitante = solEvDepSolicitante;
        this.solEvIdTipoAct = solEvIdTipoAct;
        this.solEvFechaInicio = solEvFechaInicio;
        this.solEvFechaFin = solEvFechaFin;
        this.solEvAsuntoEvento = solEvAsuntoEvento;
        this.solEvDetalleEvento = solEvDetalleEvento;
        this.solEvHoraInicio = solEvHoraInicio;
        this.solEvHoraFin = solEvHoraFin;
        this.solEvLugarEvento = solEvLugarEvento;
        this.solEvEstadoEvento = solEvEstadoEvento;
        this.solEvEstado = solEvEstado;
    }

  }