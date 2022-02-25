import { Category } from "../../categories/shared/category.model";

export class Entry {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string,
        public type?: number,
        public amount?: number,
        public paid?: boolean,
        public date?: string,
        public categoryId?: number,
        public category?: Category
    ) {}

    static typies = {
        expense: 'Despesa',
        renevue: 'Receita'
    }

    getPaidText(): string {
        return this.paid ? 'Pago' : 'Pendente';
    }
}