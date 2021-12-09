export interface IFindAllNotificationDTO {
    recipient_id: string;
    establishment_id?: string;
    offset?: number;
    limit?: number;
}
