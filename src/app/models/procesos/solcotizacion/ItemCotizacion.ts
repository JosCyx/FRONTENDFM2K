export class ItemCotizacion {
  public itmID: number;
  public itmTipoSol: number;
  public itmNumSol: number;
  public itmIdDetalle: number;
  public itmIdItem: number;
  public itmCantidad: number;
  public itmSector: number;

  constructor(data: any) {
      this.itmID = data.itmID;
      this.itmTipoSol = data.itmTipoSol;
      this.itmNumSol = data.itmNumSol;
      this.itmIdDetalle = data.itmIdDetalle;
      this.itmIdItem = data.itmIdItem;
      this.itmCantidad = data.itmCantidad;
      this.itmSector = data.itmSector;
  }
}