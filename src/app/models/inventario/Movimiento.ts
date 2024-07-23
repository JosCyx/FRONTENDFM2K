export class Movimiento {
    public RMProducto: string;
    public RMProveedor: string;
    public RMTPMovimiento: number;
    public RMFecha: string;
    public RMCantidad: number;
    public RMObservaciones: string;
    public RMTraspaso: string;
    public RMPUnitario: number;


    constructor(
        RMProducto: string,
        RMProveedor: string,
        RMTPMovimiento: number,
        RMFecha: string,
        RMCantidad: number,
        RMObservaciones: string,
        RMTraspaso: string,
        RMPUnitario: number,

    ) {
        this.RMProducto = RMProducto;
        this.RMProveedor = RMProveedor;
        this.RMTPMovimiento = RMTPMovimiento;
        this.RMFecha = RMFecha;
        this.RMCantidad = RMCantidad;
        this.RMObservaciones = RMObservaciones;
        this.RMTraspaso = RMTraspaso;
        this.RMPUnitario = RMPUnitario;

    }

}
