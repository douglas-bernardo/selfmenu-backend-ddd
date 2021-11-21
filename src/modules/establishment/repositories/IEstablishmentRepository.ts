import { ICreateEstablishmentDTO } from '../dtos/ICreateEstablishmentDTO';
import { IFindAllEstablishmentsDTO } from '../dtos/IFindAllEstablishmentDTO';
import { IFindByCNPJEstablishmentDTO } from '../dtos/IFindByCNPJEstablishmentDTO';
import { IFindByIdEstablishmentDTO } from '../dtos/IFindByIdEstablishmentDTO';
import Establishment from '../infra/typeorm/entities/Establishment';

export default interface IEstablishmentRepository {
    findAll(data: IFindAllEstablishmentsDTO): Promise<Establishment[]>;
    findById(
        data: IFindByIdEstablishmentDTO,
    ): Promise<Establishment | undefined>;
    findByCNPJ(
        data: IFindByCNPJEstablishmentDTO,
    ): Promise<Establishment | undefined>;
    create(data: ICreateEstablishmentDTO): Promise<Establishment>;
    save(establishment: Establishment): Promise<Establishment>;
}
