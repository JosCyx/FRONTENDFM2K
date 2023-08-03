export class ItemSector{
    det_id: number;
    det_descp: string;
    item_id: number;
    item_cant: number;
    item_sector: number;


    constructor(det_id: number, det_descp: string, item_id: number, item_cant: number, item_sector: number){
        this.det_id = det_id;
        this.det_descp = det_descp;
        this.item_id = item_id;
        this.item_cant = item_cant;
        this.item_sector = item_sector;
    }

}