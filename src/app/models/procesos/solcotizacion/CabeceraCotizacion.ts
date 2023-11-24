export class CabeceraCotizacion {
  public cabSolCotTipoSolicitud: number;
  public cabSolCotIdArea: number;
  public cabSolCotNumerico: string;
  public cabSolCotID: number;
  public cabSolCotNoSolicitud: number;
  public cabSolCotSolicitante: string;
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
  public cabSolCotAprobPresup: string;
  public cabSolCotMtovioDev: string;
  public cabSolCotIdEmisor: string;
  public cabSolCotApprovedBy: string;
  public cabSolCotFinancieroBy:string;
  public cabSolCotIdDept: number;
  public cabSolCotValido: number;

  constructor(data: any) {
      this.cabSolCotTipoSolicitud = data.cabSolCotTipoSolicitud;
      this.cabSolCotIdArea = data.cabSolCotArea;
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
      this.cabSolCotAprobPresup = data.cabSolCotAprobPresup;
      this.cabSolCotMtovioDev = data.cabSolCotMtovioDev;
      this.cabSolCotIdEmisor = data.cabSolCotIdEmisor;
      this.cabSolCotApprovedBy = data.cabSolCotApprovedBy;
      this.cabSolCotFinancieroBy = data.cabSolCotFinancieroBy;
      this.cabSolCotIdDept = data.cabSolCotIdDept;
      this.cabSolCotValido = data.cabSolCotValido;
  }
}