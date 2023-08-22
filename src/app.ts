import 'dotenv/config'
import { CustomerResponseItems, PayResponseItems } from "./alfacrm/interfaces/interface";
import * as moment from 'moment';
import { AlfaService } from "./alfacrm/service";
import { YandexMetrikaService } from "./yandex/service";
import { YMSendSimpleOrdersData } from './yandex/interfaces/interface';
import { YmSimpleOrderStatus } from './yandex/interfaces/enum';

class AppService {
    private readonly alfaService = new AlfaService();
    private readonly yesterday = moment().subtract(1, 'days');
    constructor() {}

    public async sendCustomerInfoToMetrika(){
        const payData = await this.alfaService.getAlfaPayData(this.yesterday.format('DD.MM.YYYY'));
        if(payData.length == 0) return;
        const ymData = await this.formatToYMData(payData);
        if(ymData.length == 0) return;
        await new YandexMetrikaService().sendSimpleOrders(ymData);
    }

    private async formatToYMData(payData: PayResponseItems[]): Promise<YMSendSimpleOrdersData[]>{
        if(payData.length == 0) return [];
        const ymData: YMSendSimpleOrdersData[]= [];
        for(const pay of payData){
            const customer = await this.alfaService.getCustomerById(pay.customer_id);
            if(customer.length == 0) continue;
            ymData.push(this.formatToYM(pay, customer[0]))
        }
        return ymData;
    }

    private formatToYM(pay: PayResponseItems, customer: CustomerResponseItems): YMSendSimpleOrdersData {
        return {
            id: String(pay.id),
            create_date_time: pay.document_date,
            client_ids: (/^\d+\nFormID:/.test(customer.note)) ? customer.note.split('\n')[0] : '',
            ...(customer.email.length != 0)? { emails: customer.email.join(',') } : {},
            ...(customer.phone.length != 0)? { phones: customer.phone.map((p: string) => p.replace(/\D/g, '')).join(','), } : {},
            client_uniq_id: `alfa_${customer.id}`,
            order_status: YmSimpleOrderStatus.PAID,
            revenue: pay.income
        }
    }
}

async function main() {
    try {
        const appService = new AppService();
        await appService.sendCustomerInfoToMetrika();
    }catch(e){
        console.log(e)
    }
}
main();