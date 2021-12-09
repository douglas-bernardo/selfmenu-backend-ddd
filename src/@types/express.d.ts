/* eslint-disable @typescript-eslint/naming-convention */
declare namespace Express {
    export interface Request {
        account: {
            id: string;
        };
        socketConnectInfo: {
            client_id?: string;
        };
    }
}
