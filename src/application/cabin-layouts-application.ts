import {CabinLayoutCommand} from "../domain/cabin-layouts/commands";
import {ExecutionResult, ExecutionResults, Failure, Success} from "./execution-results";
import {CommandType} from "../domain/core/commands";
import {CabinLayout} from "../domain/cabin-layouts/cabin-layout";
import {CabinLayoutRepository} from "../domain/cabin-layouts/cabin-layout-repository";
import {CabinLayoutId} from "../domain/cabin-layouts/cabin-layout-id";

export class CabinLayoutsApplicationService {

    private readonly repository: CabinLayoutRepository

    constructor(repository: CabinLayoutRepository) {
        this.repository = repository;
    }

    public async execute(command: CabinLayoutCommand): Promise<ExecutionResult<CabinLayoutId>> {
        try {
            const cabinLayout = await this.getCabinLayout(command);
            cabinLayout.execute(command);

            if (command.type === CommandType.InitCabinLayout) {
                await this.repository.save(cabinLayout);
            }
            else await this.repository.update(cabinLayout);

            return this.toSuccessResult(command, cabinLayout);
        } catch (error: any) {
            console.log(error);
            return this.toFailureResult(command, error);
        }
    }

    private async getCabinLayout(command: CabinLayoutCommand): Promise<CabinLayout> {
        if (command.type === CommandType.InitCabinLayout) {
            return new CabinLayout(command.aggregateId);
        } else {
            throw Error("Command not supported")
        }
    }

    private toFailureResult(command: CabinLayoutCommand, error: any) {
        return {
            aggregateId: command.aggregateId,
            result: ExecutionResults.Failure,
            error: error.message
        } as Failure<CabinLayoutId>;
    }

    private toSuccessResult(command: CabinLayoutCommand, cabinLayout: CabinLayout) {
        return {
            aggregateId: command.aggregateId,
            result: ExecutionResults.Success,
            newVersion: cabinLayout.getVersion()
        } as Success<CabinLayoutId>;
    }
}