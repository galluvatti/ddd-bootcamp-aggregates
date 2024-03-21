import {CabinLayoutRepository} from "../../domain/cabin-layouts/cabin-layout-repository";
import {CabinLayout} from "../../domain/cabin-layouts/cabin-layout";
import {CabinLayoutsDAL} from "../../data-access/cabin-layouts-dal";
import {CabinLayoutId} from "../../domain/cabin-layouts/cabin-layout-id";

export class PostgresCabinLayoutRepository implements CabinLayoutRepository {

    private dal: CabinLayoutsDAL;

    constructor(dal: CabinLayoutsDAL) {
        this.dal = dal;
    }

    async save(cabinLayout: CabinLayout) {
        await this.dal.createCabinLayout(cabinLayout);
    }

    async update(cabinLayout: CabinLayout) {
        await this.dal.updateCabinLayout(cabinLayout);
    }

    async load(aggregateId: CabinLayoutId): CabinLayout {
        return await this.dal.getLegacyCabinLayoutById(aggregateId)
    }

}