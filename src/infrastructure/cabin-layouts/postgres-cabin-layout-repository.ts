import {CabinLayoutRepository} from "../../domain/cabin-layouts/cabin-layout-repository";
import {CabinLayout} from "../../domain/cabin-layouts/cabin-layout";
import {CabinLayoutsDAL} from "../../data-access/cabin-layouts-dal";

export class PostgresCabinLayoutRepository implements CabinLayoutRepository {

    private dal: CabinLayoutsDAL;

    constructor(dal: CabinLayoutsDAL) {
        this.dal = dal;
    }

    async save(cabinLayout: CabinLayout): Promise<void> {
        await this.dal.createCabinLayout(cabinLayout);
        return Promise.resolve(undefined);
    }

}