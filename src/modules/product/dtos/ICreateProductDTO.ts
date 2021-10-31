export default interface ICreateProductDTO {
    name: string;
    description?: string;
    price: number;
    quantity: number;
    owner_id: string;
    category_id: number;
    photo?: string;
}
