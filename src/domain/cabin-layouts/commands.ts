import {Command, CommandType} from "../core/commands";
import {CabinLayoutId} from "./cabin-layout-id";
import {Row} from "./cabin-layout";

export type CabinLayoutCommand = Command<CabinLayoutId>

export type InitCabinLayout = CabinLayoutCommand & {
    type: CommandType.InitCabinLayout,
    width: number,
    length: number
}

export type AssignSeatMap = CabinLayoutCommand & {
    type: CommandType.AssignSeatMap,
    seatMap: Row[]
}