import type { Product } from "../entities/product";
import { GenericService } from "../utils/types/service";
export interface ProductService extends GenericService<Product> {
    getProductsWithDiscount: () => Promise<Product[]>;
    applyDiscount: (id: string, discount: number) => Promise<Product>;
}
