export default interface ICreateRestaurantDTO {
    name: string;
    subdomain: string;
    cnpj: number;
    owner_id: string;
    description: string;
    restaurant_type_id: number;
}
