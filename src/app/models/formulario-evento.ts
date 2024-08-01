export class FormularioEvento {

  public fEvId?: number;
  public fEvFechaEmision: string;
  public fEvSolicitante: string;
  public fEvArea: number;
  public fEvSector: number;
  public fEvNombreProyecto: string;
  public fEvReferencia: string;
  public fEvObjetivoProyecto: string;
  public fEvAlcanceProyecto: string;
  public fEvDetalleProdFinal: string;
  public fEvFechaInicio: string;
  public fEvFechaFin: string;
  public fEvEstadoProyecto: number;
  public fEvPorcentajeTotal: number;
  public fEvPorcentajeNuevos: number;
  public fEvEstadoActivo: number;

  constructor(

  fEvId: number,
  fEvFechaEmision: string,
  fEvSolicitante: string,
  fEvArea: number,
  fEvSector: number,
  fEvNombreProyecto: string,
  fEvReferencia: string,
  fEvObjetivoProyecto: string,
  fEvAlcanceProyecto: string,
  fEvDetalleProdFinal: string,
  fEvFechaInicio: string,
  fEvFechaFin: string,
  fEvEstadoProyecto: number,
  fEvPorcentajeTotal: number,
  fEvPorcentajeNuevos: number,
  fEvEstadoActivo: number

  ) {
    this.fEvId = fEvId;
    this.fEvFechaEmision = fEvFechaEmision;
    this.fEvSolicitante = fEvSolicitante;
    this.fEvArea = fEvArea;
    this.fEvSector = fEvSector;
    this.fEvNombreProyecto = fEvNombreProyecto;
    this.fEvReferencia = fEvReferencia;
    this.fEvObjetivoProyecto = fEvObjetivoProyecto;
    this.fEvAlcanceProyecto = fEvAlcanceProyecto;
    this.fEvDetalleProdFinal = fEvDetalleProdFinal;
    this.fEvFechaInicio = fEvFechaInicio;
    this.fEvFechaFin = fEvFechaFin;
    this.fEvEstadoProyecto = fEvEstadoProyecto;
    this.fEvPorcentajeTotal = fEvPorcentajeTotal;
    this.fEvPorcentajeNuevos = fEvPorcentajeNuevos;
    this.fEvEstadoActivo = fEvEstadoActivo;
  }







}