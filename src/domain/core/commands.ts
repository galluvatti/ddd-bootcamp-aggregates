export type Command<TAggregateId> = {
    aggregateId: TAggregateId,
    type: CommandType,
}

export enum CommandType {
    InitCabinLayout = "InitCabinLayout",
    AssignSeatMap = "AssignSeatMap",
}