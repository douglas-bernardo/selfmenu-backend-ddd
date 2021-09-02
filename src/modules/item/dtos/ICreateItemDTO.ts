interface IImage {
    url: string;
}

export default interface ICreateItemDTO {
    name: string;
    description?: string;
    price: number;
    quantity: number;
    owner_id: string;
    category_id: number;
    images?: IImage[];
}
