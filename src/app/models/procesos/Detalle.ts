export class Detalle{
    cab_id: number;
    det_id: number;
    det_descp: string;
    det_unidad: number;
    det_cantidad: number;


    constructor(cab_id: number, det_id: number, det_descp: string, det_unidad: number, det_cantidad: number){
        this.cab_id = cab_id;
        this.det_id = det_id;
        this.det_descp = det_descp;
        this.det_unidad = det_unidad;
        this.det_cantidad = det_cantidad;
    }

}