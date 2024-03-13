import AbstractController from "./AbstractController";
import {Request, Response} from "express";
import RoomService from "../service/RoomService";
import {BadRequestError, NotFoundError, UnauthorizedError} from "../util/exception/AWSRoomBookingSystemError";
import ResponseCodeMessage from "../util/enum/ResponseCodeMessage";
import RoomDTO from "../model/dto/RoomDTO";
import BuildingDTO from "../model/dto/BuildingDTO";
import EquipmentDTO from "../model/dto/EquipmentDTO";

export default class RoomController extends AbstractController {
    private roomService: RoomService;

    constructor(roomService: RoomService) {
        super();
        this.roomService = roomService;
    }

    public getAll = async (req: Request, res: Response): Promise<Response> => {
        try {
            const rooms = await this.roomService.getAll();
            return super.onResolve(res, rooms);
        } catch (error: unknown) {
            if (error instanceof UnauthorizedError) {
                return super.onReject(res, error.code, error.message);
            } else {
                return super.onReject(
                    res,
                    ResponseCodeMessage.UNEXPECTED_ERROR_CODE,
                    "An error occurred while fetching rooms."
                );
            }
        }
    };

    public getById = async (req: Request, res: Response): Promise<Response> => {
        try {
            const roomId = parseInt(req.params.id);
            if (isNaN(roomId)) {
                return super.onReject(res, ResponseCodeMessage.BAD_REQUEST_ERROR_CODE, "Invalid room ID.");
            }
            const room = await this.roomService.getById(roomId);
            return super.onResolve(res, room);
        } catch (error: unknown) {
            if (error instanceof NotFoundError) {
                return super.onReject(res, ResponseCodeMessage.NOT_FOUND_CODE, error.message);
            } else if (error instanceof UnauthorizedError) {
                return super.onReject(res, error.code, error.message);
            } else {
                // Generic error handling
                return super.onReject(
                    res,
                    ResponseCodeMessage.UNEXPECTED_ERROR_CODE,
                    "An error occurred while fetching room details."
                );
            }
        }
    };

    public create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const room = new RoomDTO();
            room.building = new BuildingDTO();
            room.building.buildingId = req.body.buildingId;
            room.floorNumber = req.body.floorNumber;
            room.roomCode = req.body.roomCode;
            room.roomName = req.body.roomName;
            room.equipmentList = [];
            for (const equipmentId of req.body.equipmentIds) {
                const equipment = new EquipmentDTO();
                equipment.equipmentId = equipmentId;
                room.equipmentList!.push(equipment);
            }
            room.numberOfSeats = req.body.numberOfSeats;
            room.isActive = req.body.isActive;
            const newRoom = await this.roomService.create(room);
            return super.onResolve(res, newRoom);
        } catch (error: unknown) {
            console.log(error);
            if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
                return super.onReject(res, error.code, error.message);
            } else {
                // Generic error handling
                return super.onReject(
                    res,
                    ResponseCodeMessage.UNEXPECTED_ERROR_CODE,
                    "An error occurred while creating the room."
                );
            }
        }
    };

    public update = async (req: Request, res: Response): Promise<Response> => {
        try {
            const roomId = parseInt(req.params.id);
            if (isNaN(roomId)) {
                throw new BadRequestError('Invalid room ID');
            }
            const updateRoom: Partial<RoomDTO> = {};

            if (req.body.buildingId !== undefined) {
                updateRoom.building = new BuildingDTO();
                updateRoom.building.buildingId = req.body.buildingId;
            }

            if (req.body.floorNumber !== undefined) {
                updateRoom.floorNumber = req.body.floorNumber;
            }

            if (req.body.roomCode !== undefined) {
                updateRoom.roomCode = req.body.roomCode;
            }

            if (req.body.roomName !== undefined) {
                updateRoom.roomName = req.body.roomName;
            }

            if (req.body.equipmentList !== undefined) {
                updateRoom.equipmentList = req.body.equipmentList.map((equipment: any) => {
                    const equipmentDto = new EquipmentDTO();
                    equipmentDto.equipmentId = equipment.equipmentId;
                    return equipmentDto;
                });
            }

            if (req.body.numberOfSeats !== undefined) {
                updateRoom.numberOfSeats = req.body.numberOfSeats;
            }

            if (req.body.isActive !== undefined) {
                updateRoom.isActive = req.body.isActive;
            }

            const newRoom = await this.roomService.update(roomId, updateRoom);
            return super.onResolve(res, newRoom);

        } catch (error: unknown) {
            console.log(error);
            if (error instanceof NotFoundError) {
                return super.onReject(res, ResponseCodeMessage.NOT_FOUND_CODE, error.message);
            }else if (error instanceof BadRequestError || error instanceof UnauthorizedError) {
                return super.onReject(res, error.code, error.message);
            } else {
                // Generic error handling
                return super.onReject(
                    res,
                    ResponseCodeMessage.UNEXPECTED_ERROR_CODE,
                    "An error occurred while updating the room."
                );
            }
        }
    };
}
