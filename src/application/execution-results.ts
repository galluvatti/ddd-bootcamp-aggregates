export enum ExecutionResults {
    Success = "SUCCESS",
    Failure = "FAILURE"
}

export type ExecutionResult<TAggregateID> = {
    aggregateId: TAggregateID;
    result: ExecutionResults.Success | ExecutionResults.Failure;
}

export type Success<TAggregateID> = ExecutionResult<TAggregateID> & {
    result: ExecutionResults.Success;
    newVersion: number;
}

export type Failure<TAggregateID> = ExecutionResult<TAggregateID> & {
    result: ExecutionResults.Failure;
    error: string;
}