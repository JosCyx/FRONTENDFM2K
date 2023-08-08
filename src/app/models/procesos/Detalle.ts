export class Detalle{
    det_id: number;
    det_descp: string;
    det_unidad: string;
    det_cantidad: number;


    constructor(det_id: number, det_descp: string, det_unidad: string, det_cantidad: number){
        this.det_id = det_id;
        this.det_descp = det_descp;
        this.det_unidad = det_unidad;
        this.det_cantidad = det_cantidad;
    }

}