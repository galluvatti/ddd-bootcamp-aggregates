import express from 'express';
import {CabinLayoutsApplicationService} from "../application/cabin-layouts-application";
import {PostgresCabinLayoutRepository} from "../infrastructure/cabin-layouts/postgres-cabin-layout-repository";
import {AssignSeatMap, InitCabinLayout} from "../domain/cabin-layouts/commands";
import {CommandType} from "../domain/core/commands";
import {ExecutionResults} from "../application/execution-results";
import {pool} from "../data-access/db";
import {CabinLayoutsDAL} from "../data-access/cabin-layouts-dal";

export const router = express.Router();


const application = new CabinLayoutsApplicationService(new PostgresCabinLayoutRepository(new CabinLayoutsDAL(pool)));

router.post('/', async (req, res) => {
    const command: InitCabinLayout = {
        type: CommandType.InitCabinLayout,
        aggregateId: req.body.id,
        width: req.body.width,
        length: req.body.length
    }
    const result = await application.execute(command);
    if (result.result === ExecutionResults.Success) {
        return res.status(201).json(result);
    } else {
        return res.status(409).json(result);
    }
});

router.put('/:id', async (req, res) => {
    const command: AssignSeatMap = {
        type: CommandType.AssignSeatMap,
        aggregateId: req.params.id,
        seatMap: req.body.rows
    }
    const result = await application.execute(command);
    if (result.result === ExecutionResults.Success) {
        return res.status(200).json(result);
    } else {
        return res.status(409).json(result);
    }
});