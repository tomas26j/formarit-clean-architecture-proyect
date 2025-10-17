import type { Entity } from "./entity.js";
export interface GenericService<TEntity extends Entity> {
    findById: (id: string) => Promise<TEntity | undefined> // T es un tipo generico que se define al momento de implementar la interfaz
    findAll: () => Promise<TEntity[]> // findAll s
    editOne: (data: TEntity) => Promise<TEntity>;
    deleteOne: (data: TEntity) => Promise<void>;
    saveOne: (data: TEntity) => void;
    updateMany: (data: TEntity[]) => Promise<TEntity[] | undefined>;
}

