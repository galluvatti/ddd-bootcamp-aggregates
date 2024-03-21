import {CabinLayout} from "./cabin-layout";
import {CabinLayoutId} from "./cabin-layout-id";

export interface CabinLayoutRepository {
    save(cabinLayout: CabinLayout):void;
    update(cabinLayout: CabinLayout): void;
    load(aggregateId: CabinLayoutId): CabinLayout;
}