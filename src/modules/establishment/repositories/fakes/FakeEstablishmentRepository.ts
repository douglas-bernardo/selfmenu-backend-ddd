import { v4 as uuid } from 'uuid';

import ICreateEstablishmentDTO from '@modules/establishment/dtos/ICreateEstablishmentDTO';
import Establishment from '@modules/establishment/infra/typeorm/entities/Establishment';
import IFindAllEstablishmentsDTO from '@modules/establishment/dtos/IFindAllEstablishmentDTO';
import IFindByIdEstablishmentDTO from '@modules/establishment/dtos/IFindByIdEstablishmentDTO';
import IFindByCNPJEstablishmentDTO from '@modules/establishment/dtos/IFindByCNPJEstablishmentDTO';
import IEstablishmentRepository from '../IEstablishmentRepository';

class FakeEstablishmentRepository implements IEstablishmentRepository {
    private establishments: Establishment[] = [];

    public async findByCNPJ({
        cnpj,
    }: IFindByCNPJEstablishmentDTO): Promise<Establishment | undefined> {
        const findEstablishment = this.establishments.find(
            establishment => establishment.cnpj === cnpj,
        );

        return findEstablishment;
    }

    public async findById({
        establishment_id,
        owner_id,
    }: IFindByIdEstablishmentDTO): Promise<Establishment | undefined> {
        let findEstablishment: Establishment | undefined;

        if (owner_id) {
            findEstablishment = this.establishments.find(
                establishment =>
                    establishment.id === establishment_id &&
                    establishment.owner_id === owner_id,
            );
        } else {
            findEstablishment = this.establishments.find(
                establishment => establishment.id === establishment_id,
            );
        }

        return findEstablishment;
    }

    public async findAll({
        owner_id,
    }: IFindAllEstablishmentsDTO): Promise<Establishment[]> {
        let { establishments } = this;

        if (owner_id) {
            establishments = this.establishments.filter(
                establishment => establishment.owner_id === owner_id,
            );
        }

        return establishments;
    }

    public async create(data: ICreateEstablishmentDTO): Promise<Establishment> {
        const establishment = new Establishment();

        Object.assign(establishment, { id: uuid(), active: true }, data);
        this.establishments.push(establishment);
        return establishment;
    }

    public async save(establishment: Establishment): Promise<Establishment> {
        const findIndex = this.establishments.findIndex(
            findEstablishment => findEstablishment.id === establishment.id,
        );

        this.establishments[findIndex] = establishment;
        return establishment;
    }
}

export default FakeEstablishmentRepository;
