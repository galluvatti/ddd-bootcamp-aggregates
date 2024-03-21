import {CabinLayoutId} from "./cabin-layout-id";
import {AssignSeatMap, CabinLayoutCommand, InitCabinLayout} from "./commands";
import {CommandType} from "../core/commands";
import {CabinLayoutStatus} from "./cabin-layout-status";
import {Seat} from "./seat";

export class CabinLayout {
    public readonly id: CabinLayoutId;
    private version: number;

    private width: number = 0;
    private length: number = 0;
    private status: CabinLayoutStatus = CabinLayoutStatus.Draft;
    private rows: Row[];


   getVersion(): number {
        return this.version;
    }

    constructor(id: CabinLayoutId, version: number = 0) {
        this.id = id;
        this.version = version;
    }

    execute(command: CabinLayoutCommand) {
        if (command.aggregateId !== this.id) {
            throw new Error("Invalid command");
        }
        if (command.type === CommandType.InitCabinLayout) {
            let cmd = command as InitCabinLayout;
            this.initCabinLayout(cmd.width, cmd.length);
        }
        if (command.type === CommandType.AssignSeatMap) {
            let cmd = command as AssignSeatMap;
            this.assignSeatMap(cmd.seatMap);
        }
    }

    private initCabinLayout(width: number, length: number) {
        this.width = width;
        this.length = length;
    }

    private assignSeatMap(seatMap: Row[]) {
        this.rows = seatMap;
    }
}

export class Row {
    constructor(
        public seatTypeId: Seat['id'],
        public seatGroups: number[],
        public extraSpace: number
    ) { }
}