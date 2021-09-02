interface IItem {
    item_id: string;
}

export default interface ICreateMenuDTO {
    title: string;
    description?: string;
    owner_id: string;
    restaurant_id: string;
    items?: IItem[];
}
