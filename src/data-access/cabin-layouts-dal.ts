import {Pool} from 'pg';
import {LegacyCabinLayout} from '../model/legacy-cabin-layout';
import {CabinLayout} from "../domain/cabin-layouts/cabin-layout";

export class CabinLayoutsDAL {
    private pool: Pool;

    constructor(pool: Pool) {
        this.pool = pool;
    }

    async createCabinLayout(cabinLayout: CabinLayout): Promise<CabinLayout> {
        const query = `INSERT INTO fleetops.cabin_layouts (layout_id, layout_data)
                       VALUES ($1, $2)`;
        await this.pool.query(query, [cabinLayout.id, JSON.stringify(cabinLayout)]);
        return cabinLayout
    }

    async updateCabinLayout(cabinLayout: CabinLayout): Promise<void> {
        const query = `UPDATE fleetops.cabin_layouts
                       SET layout_data = $1,
                           __version   = __version + 1
                       WHERE layout_id = $2
                         AND __version = $3
                       RETURNING *`;

        const data = JSON.stringify(cabinLayout);
        const expectedVersion = cabinLayout.getVersion();
        const id = cabinLayout.id;

        const rows = await this.pool.query(query, [data, id, expectedVersion.toString()]);
        if (rows.rowCount === 0) {
            throw new Error("Cabin not found or version mismatch");
        }

        cabinLayout.version++;
    }

    async getCabinLayoutById(cabinLayoutId: string): Promise<CabinLayout | null> {
        const query = `SELECT layout_data, __version
                       FROM fleetops.cabin_layouts
                       WHERE layout_id = $1`;
        const res = await this.pool.query(query, [cabinLayoutId]);

        if (res.rows.length) {
            return this.map(res.rows[0].layout_data, res.rows[0].__version);
        } else {
            return null;
        }
    }

    async legacyCreateCabinLayout(cabinLayout: LegacyCabinLayout): Promise<LegacyCabinLayout> {
        const query = `INSERT INTO fleetops.cabin_layouts (layout_id, layout_data)
                       VALUES ($1, $2)`;
        await this.pool.query(query, [cabinLayout.layoutId, JSON.stringify(cabinLayout)]);
        return cabinLayout
    }

    async getCabinLayouts(): Promise<LegacyCabinLayout[]> {
        const query = `SELECT layout_data, __version
                       FROM fleetops.cabin_layouts`;
        const res = await this.pool.query(query);
        return res.rows.map(row => this.mapLegacy(row.layout_data, row.__version));
    }

    async getLegacyCabinLayoutById(cabinLayoutId: string): Promise<LegacyCabinLayout | null> {
        const query = `SELECT layout_data, __version
                       FROM fleetops.cabin_layouts
                       WHERE layout_id = $1`;
        const res = await this.pool.query(query, [cabinLayoutId]);

        if (res.rows.length) {
            return this.mapLegacy(res.rows[0].layout_data, res.rows[0].__version);
        } else {
            return null;
        }
    }

    async legacyUpdateCabinLayout(cabinLayout: LegacyCabinLayout): Promise<void> {
        const query = `UPDATE fleetops.cabin_layouts
                       SET layout_data = $1,
                           __version   = __version + 1
                       WHERE layout_id = $2
                         AND __version = $3
                       RETURNING *`;

        const data = JSON.stringify(cabinLayout);
        const expectedVersion = cabinLayout.version;
        const id = cabinLayout.layoutId;

        const rows = await this.pool.query(query, [data, id, expectedVersion.toString()]);
        if (rows.rowCount === 0) {
            throw new Error("Cabin not found or version mismatch");
        }

        cabinLayout.version++;
    }


    async deleteCabinLayout(cabinLayout: LegacyCabinLayout): Promise<void> {
        const query = `DELETE
                       FROM fleetops.cabin_layouts
                       WHERE layout_id = $1`;
        await this.pool.query(query, [cabinLayout.layoutId]);
    }

    private mapLegacy(unitData: any, version: number): LegacyCabinLayout {
        const result = unitData as LegacyCabinLayout;
        result.version = version;
        return result
    }

    private map(unitData: any, version: number): CabinLayout {
        const result = unitData as CabinLayout;
        result.version = version;
        return result
    }
}
