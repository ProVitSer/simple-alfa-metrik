export interface FormatCustomerData {
    clientId: number;
    name: string;
    phones: string;
    emails: string;
    ymId: string;
    crmOrderId: string;
    sendFormDate: Date;
    payInfo: FormatPayInfo[];
}

export interface FormatPayInfo {
    id: number;
    sum: string;
    date: string  
}