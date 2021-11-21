export default interface IFindAllProductsByCategoryIdDTO {
    owner_id: string;
    category_id: number;
    offset?: number;
    limit?: number;
}
