export class CabeceraPago {
  public cabPagoID: number;
  public cabPagoNumerico: string;
  public cabPagoTipoSolicitud: number;
  public cabPagoNoSolicitud: number;
  public cabPagoIdAreaSolicitante: number;
  public cabPagoIdDeptSolicitante: number;
  public cabPagoSolicitante: string;
  public cabPagoNoOrdenCompra: string;
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
  public cabPagoReceptor: number;
  public cabPagoFechaInspeccion: string;
  public cabPagoCancelacionOrden: string | null;
  public cabPagoEstado: string;
  public cabPagoEstadoTrack: number;
  public cabPagoIdEmisor: string;
  public cabPagoApprovedBy: string;

  constructor(data: any) {
    this.cabPagoID = data.cabPagoID;
    this.cabPagoNumerico = data.cabPagoNumerico;
    this.cabPagoTipoSolicitud = data.cabPagoTipoSolicitud;
    this.cabPagoNoSolicitud = data.cabPagoNoSolicitud;
    this.cabPagoIdAreaSolicitante = data.cabPagoIdAreaSolicitante;
    this.cabPagoIdDeptSolicitante = data.cabPagoIdDeptSolicitante;
    this.cabPagoSolicitante = data.cabPagoSolicitante;
    this.cabPagoNoOrdenCompra = data.cabPagoNoOrdenCompra;
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
  }
}
