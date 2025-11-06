import type { Entity } from "./entity.js";
export interface GenericService<TEntity extends Entity> {
    findById: (id: string) => Promise<TEntity | undefined>;
    findAll: () => Promise<TEntity[]>;
    editOne: (data: TEntity) => Promise<TEntity>;
    deleteOne: (data: TEntity) => Promise<void>;
    saveOne: (data: TEntity) => void;
    updateMany: (data: TEntity[]) => Promise<TEntity[] | undefined>;
}
