import { YmSimpleOrderStatus } from "./enum";

export interface YMSendSimpleOrdersData {
    id: string;
    create_date_time: Date;
    client_ids: string;
    emails?: string;
    phones?: string;
    client_uniq_id?: string;
    order_status: YmSimpleOrderStatus;
    revenue?: string;
}