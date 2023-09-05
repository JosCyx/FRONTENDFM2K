export class DetallePago{
    public  detPagoID:number;
    public  detPagoTipoSol :number;
    public  detPagoNoSol :number;
    public  detPagoIdDetalle :number;
    public  detPagoItemDesc:string;
    public  detPagoCantContratada :number;
    public  detPagoCantRecibida:number; 
    public  detPagoValUnitario :number;
    public  detPagoSubtotal :number;
    constructor(data:any) {
        this.detPagoID = data.detPagoID;
        this.detPagoTipoSol = data.detPagoTipoSol;
        this.detPagoNoSol = data.detPagoNoSol;
        this.detPagoIdDetalle = data.detPagoIdDetalle;
        this.detPagoItemDesc=data.detPagoItemDesc;
        this.detPagoCantContratada = data.detPagoCantContratada;
        this.detPagoCantRecibida=data.detPagoCantRecibida;
        this.detPagoValUnitario = data.detPagoValUnitario;
        this.detPagoSubtotal=data.detPagoSubtotal;
    }
}