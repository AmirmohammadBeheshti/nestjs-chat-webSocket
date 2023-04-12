import { Pagination } from '../tapsa-repository/tapsa-repository.type';
import {
  PaginatedSerializable,
  Serializable,
} from './tapsa-serializer.serializable';

export abstract class BaseSerializer<Tentity, Trodto> {
  public abstract serialize(
    value: Tentity,
    outputType?: string,
  ): Promise<Trodto>;

  public abstract serializePaginated(
    value: Pagination<Tentity>,
    outputType?: string,
  ): Promise<Pagination<Trodto>>;

  public serializeCollection(
    values: Tentity[],
    outputType?: string,
  ): Promise<Trodto[]> {
    return Promise.all<Trodto>(
      values.map((v) => this.serialize(v, outputType)),
    );
  }

  public markSerializableCollection(
    values: Tentity[],
    outputType?: string,
  ): Serializable<Trodto[]> {
    return new Serializable<Trodto[]>(
      this.serializeCollection.bind(this, values, outputType),
    );
  }
}
