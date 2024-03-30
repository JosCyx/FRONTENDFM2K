export class CabeceraOrdenCompra {
  public cabSolOCTipoSolicitud: number;
  public cabSolOCIdArea: number;
  public cabSolOCIdDept: number
  public cabSolOCNumerico: string;
  public cabSolOCID: number;
  public cabSolOCNoSolicitud: number;
  public cabSolOCSolicitante: string;
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
  public cabSolOCIdEmisor: string;
  public cabSolOCApprovedBy: string;
  public cabSolOCFinancieroBy: string;
  public cabSolOCAprobPresup: string;
  public cabSolOCMotivoDev: string;
  public cabSolOCValorAprobacion: number;
  public cabSolOCValido: number;
  public cabSolOCSinPresupuesto: number;

  constructor(data: any) {
    this.cabSolOCTipoSolicitud = data.cabSolOCTipoSolicitud;
    this.cabSolOCIdArea = data.cabSolOCIdArea;
    this.cabSolOCIdDept = data.cabSolOCIdDept;
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
    this.cabSolOCAprobPresup=data.cabSolOCAprobPresup;
    this.cabSolOCMotivoDev=data.cabSolOCMotivoDev;
    this.cabSolOCValorAprobacion=data.cabSolOCValorAprobacion;
    this.cabSolOCValido = data.cabSolOCValido;
    this.cabSolOCSinPresupuesto = data.cabSolOCSinPresupuesto;
  }
}