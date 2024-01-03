export class CabeceraPago {
  public cabPagoID: number;
  public cabPagoNumerico: string;
  public cabPagoTipoSolicitud: number;
  public cabPagoNoSolicitud: number;
  public cabPagoIdAreaSolicitante: number;
  public cabPagoIdDeptSolicitante: number;
  public cabPagoSolicitante: string;
  public cabPagoFechaEmision: string;
  public cabPagoFechaEnvio: string;
  public cabPagoNumFactura: string;
  public cabPagoFechaFactura: string;
  public cabPagoProveedor: string ;
  public cabPagoRucProveedor: string;
  public cabpagototal: number;
  public cabPagoObservaciones: string | null;
  public cabPagoAplicarMulta: string | null;
  public cabPagoValorMulta: number;
  public cabPagoValorTotalAut: number;
  public cabPagoReceptor: string;
  public cabPagoFechaInspeccion: string;
  public cabPagoCancelacionOrden: string;
  public cabPagoEstado: string;
  public cabPagoEstadoTrack: number;
  public cabPagoIdEmisor: string;
  public cabPagoApprovedBy: string;
  public cabPagoObservCancelacion: string;
  public cabPagoNoSolOC: string;
  public cabPagoValido: number;
  public cabPagoMotivoDev: string;
  public cabPagoFrom: string;
  public cabPagoIfDestino: string;
  public cabPagoType: string;

  constructor(data: any) {
    this.cabPagoID = data.cabPagoID;
    this.cabPagoNumerico = data.cabPagoNumerico;
    this.cabPagoTipoSolicitud = data.cabPagoTipoSolicitud;
    this.cabPagoNoSolicitud = data.cabPagoNoSolicitud;
    this.cabPagoIdAreaSolicitante = data.cabPagoIdAreaSolicitante;
    this.cabPagoIdDeptSolicitante = data.cabPagoIdDeptSolicitante;
    this.cabPagoSolicitante = data.cabPagoSolicitante;
    this.cabPagoFechaEmision = data.cabPagoFechaEmision;
    this.cabPagoFechaEnvio = data.cabPagoFechaEnvio;
    this.cabPagoNumFactura = data.cabPagoNumFactura;
    this.cabPagoFechaFactura = data.cabPagoFechaFactura;
    this.cabPagoProveedor = data.cabPagoProveedor;
    this.cabPagoRucProveedor = data.cabPagoRucProveedor;
    this.cabpagototal=data.cabpagototal;
    this.cabPagoObservaciones = data.cabPagoObservaciones;
    this.cabPagoAplicarMulta = data.cabPagoAplicarMulta;
    this.cabPagoValorMulta = data.cabPagoValorMulta;
    this.cabPagoValorTotalAut = data.cabPagoValorTotalAut;
    this.cabPagoReceptor = data.cabPagoReceptor;
    this.cabPagoFechaInspeccion = data.cabPagoFechaInspeccion;
    this.cabPagoCancelacionOrden = data.cabPagoCancelacionOrden;
    this.cabPagoEstado = data.cabPagoEstado;
    this.cabPagoEstadoTrack = data.cabPagoEstadoTrack;
    this.cabPagoIdEmisor = data.cabPagoIdEmisor;
    this.cabPagoApprovedBy = data.cabPagoApprovedBy;
    this.cabPagoObservCancelacion = data.cabPagoObservCancelacion;
    this.cabPagoNoSolOC = data.cabPagoNoSolOC;
    this.cabPagoValido = data.cabPagoValido;
    this.cabPagoMotivoDev = data.cabPagoMotivoDev;
    this.cabPagoFrom = data.cabPagoFrom;
    this.cabPagoIfDestino = data.cabPagoIfDestino;
    this.cabPagoType = data.cabPagoType;
  }
}
