import {CabinLayout} from "./cabin-layout";

export interface CabinLayoutRepository {
    save(cabinLayout: CabinLayout): Promise<void>;
    update(cabinLayout: CabinLayout): Promise<void>;
}