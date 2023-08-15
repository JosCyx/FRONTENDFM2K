export class CabeceraCotizacion {
  public cabSolCotTipoSolicitud: number;
  public cabSolCotArea: number;
  public cabSolCotNumerico: string;
  public cabSolCotID: number;
  public cabSolCotNoSolicitud: number;
  public cabSolCotSolicitante: number;
  public cabSolCotFecha: string;
  public cabSolCotAsunto: string;
  public cabSolCotProcedimiento: string;
  public cabSolCotObervaciones: string;
  public cabSolCotAdjCot: string;
  public cabSolCotNumCotizacion: number | null;
  public cabSolCotEstado: string;
  public cabSolCotEstadoTracking: number;
  public cabSolCotPlazoEntrega: string;
  public cabSolCotFechaMaxentrega: string;
  public cabSolCotInspector: number | null;
  public cabSolCotTelefInspector: string;

  constructor(data: any) {
      this.cabSolCotTipoSolicitud = data.cabSolCotTipoSolicitud;
      this.cabSolCotArea = data.cabSolCotArea;
      this.cabSolCotNumerico = data.cabSolCotNumerico;
      this.cabSolCotID = data.cabSolCotID;
      this.cabSolCotNoSolicitud = data.cabSolCotNoSolicitud;
      this.cabSolCotSolicitante = data.cabSolCotSolicitante;
      this.cabSolCotFecha = data.cabSolCotFecha;
      this.cabSolCotAsunto = data.cabSolCotAsunto;
      this.cabSolCotProcedimiento = data.cabSolCotProcedimiento;
      this.cabSolCotObervaciones = data.cabSolCotObervaciones;
      this.cabSolCotAdjCot = data.cabSolCotAdjCot;
      this.cabSolCotNumCotizacion = data.cabSolCotNumCotizacion;
      this.cabSolCotEstado = data.cabSolCotEstado;
      this.cabSolCotEstadoTracking = data.cabSolCotEstadoTracking;
      this.cabSolCotPlazoEntrega = data.cabSolCotPlazoEntrega;
      this.cabSolCotFechaMaxentrega = data.cabSolCotFechaMaxentrega;
      this.cabSolCotInspector = data.cabSolCotInspector;
      this.cabSolCotTelefInspector = data.cabSolCotTelefInspector;
  }
}