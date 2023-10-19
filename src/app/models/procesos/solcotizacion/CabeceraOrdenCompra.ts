export class CabeceraOrdenCompra {
  public cabSolOCTipoSolicitud: number;
  public cabSolOCArea: number;
  public cabSolOCNumerico: string;
  public cabSolOCID: number;
  public cabSolOCNoSolicitud: number;
  public cabSolOCSolicitante: number;
  public cabSolOCFecha: string;
  public cabSolOCAsunto: string;
  public cabSolOCProcedimiento: string;
  public cabSolOCObervaciones: string;
  public cabSolOCAdjCot: string;
  public cabSolOCNumCotizacion: number | null;
  public cabSolOCEstado: string;
  public cabSolOCEstadoTracking: number;
  public cabSolOCPlazoEntrega: string;
  public cabSolOCFechaMaxentrega: string;
  public cabSolOCInspector: number | null;
  public cabSolOCTelefInspector: string;
  public cabSolOCProveedor:string
  public cabSolOCRUCProveedor:string;
  public cabSolOCIdEmisor: number;
  public cabSolOCApprovedBy: number;
  public cabSolOCFinancieroBy:number;

  constructor(data: any) {
    this.cabSolOCTipoSolicitud = data.cabSolOCTipoSolicitud;
    this.cabSolOCArea = data.cabSolOCArea;
    this.cabSolOCNumerico = data.cabSolOCNumerico;
    this.cabSolOCID = data.cabSolOCID;
    this.cabSolOCNoSolicitud = data.cabSolOCNoSolicitud;
    this.cabSolOCSolicitante = data.cabSolOCSolicitante;
    this.cabSolOCFecha = data.cabSolOCFecha;
    this.cabSolOCAsunto = data.cabSolOCAsunto;
    this.cabSolOCProcedimiento = data.cabSolOCProcedimiento;
    this.cabSolOCObervaciones = data.cabSolOCObervaciones;
    this.cabSolOCAdjCot = data.cabSolOCAdjCot;
    this.cabSolOCNumCotizacion = data.cabSolOCNumCotizacion;
    this.cabSolOCEstado = data.cabSolOCEstado;
    this.cabSolOCEstadoTracking = data.cabSolOCEstadoTracking;
    this.cabSolOCPlazoEntrega = data.cabSolOCPlazoEntrega;
    this.cabSolOCFechaMaxentrega = data.cabSolOCFechaMaxentrega;
    this.cabSolOCInspector = data.cabSolOCInspector;
    this.cabSolOCTelefInspector = data.cabSolOCTelefInspector;
    this.cabSolOCProveedor=data.cabSolOCProveedor;
    this.cabSolOCRUCProveedor=data.cabSolOCRUCProveedor;
    this.cabSolOCIdEmisor = data.cabSolOCIdEmisor;
    this.cabSolOCApprovedBy = data.cabSolOCApprovedBy;
    this.cabSolOCFinancieroBy=data.cabSolOCFinancieroBy;
  }
}