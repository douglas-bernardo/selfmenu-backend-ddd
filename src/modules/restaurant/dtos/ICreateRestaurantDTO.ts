export default interface ICreateRestaurantDTO {
    name: string;
    subdomain: string;
    cnpj: string;
    owner_id: string;
    description: string;
    restaurant_type_id: number;
}
