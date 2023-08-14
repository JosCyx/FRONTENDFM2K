export class DetalleCotizacion {
  public solCotID: number;
  public solCotTipoSol: number;
  public solCotNoSol: number;
  public solCotIdDetalle: number;
  public solCotDescripcion: string;
  public solCotUnidad: string;
  public solCotCantidadTotal: number;

  constructor(data: any) {
      this.solCotID = data.solCotID;
      this.solCotTipoSol = data.solCotTipoSol;
      this.solCotNoSol = data.solCotNoSol;
      this.solCotIdDetalle = data.solCotIdDetalle;
      this.solCotDescripcion = data.solCotDescripcion;
      this.solCotUnidad = data.solCotUnidad;
      this.solCotCantidadTotal = data.solCotCantidadTotal;
  }
}