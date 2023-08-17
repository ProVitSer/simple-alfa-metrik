import 'dotenv/config'
import { CustomerResponseItems, PayResponseItems } from "./alfacrm/interfaces/interface";
import * as moment from 'moment';
import { AlfaService } from "./alfacrm/service";
import { FormatCustomerData, FormatPayInfo } from "./app.interface";
import { YandexMetrikaService } from "./yandex/service";
import { YMSendSimpleOrdersData } from './yandex/interfaces/interface';
import { YmSimpleOrderStatus } from './yandex/interfaces/enum';

class AppService {
    private readonly alfaService = new AlfaService();
    constructor() {}

    public async sendCustomerInfoToMetrika(){
        const filterCustomerData = await this.getCustomerData()
        if(filterCustomerData.length == 0) return;
        await this.formatAndSendToYM(filterCustomerData);
    }

    private async formatAndSendToYM(customerData: CustomerResponseItems[]){
        const formatData = await this.formatCustomersData(customerData);
        console.log(JSON.stringify(formatData));
        const ymData = this.checkAndFormatToYMData(formatData);
        if(ymData.length == 0) return;
        await new YandexMetrikaService().sendSimpleOrders(ymData);
    }

    private checkAndFormatToYMData(formatData: FormatCustomerData[]): YMSendSimpleOrdersData[]{
        const today = moment();
        const ymData: YMSendSimpleOrdersData[] = [];
        formatData.map((item: FormatCustomerData) => {
            const sendFormDate = moment(item.sendFormDate, 'YYYY-MM-DD HH:mm:ss');
            if (sendFormDate.isSame(today, 'day') && item.payInfo.length === 0) {
                ymData.push(this.formatToYM(item, YmSimpleOrderStatus.IN_PROGRESS))
            } else if (sendFormDate.isSame(today, 'day') && item.payInfo.length > 0) {
                const payInfoWithTodayDate = item.payInfo.find(info => moment(info.date, 'DD.MM.YYYY').isSame(today, 'day'));
                if (payInfoWithTodayDate) {
                    ymData.push(this.formatToYM(item, YmSimpleOrderStatus.PAID, payInfoWithTodayDate.sum, payInfoWithTodayDate.id))
                }
            }
        })
        return ymData;
    }

    private formatToYM(item: FormatCustomerData, orderStatus: YmSimpleOrderStatus, sum?: string, payId?: number): YMSendSimpleOrdersData {
        return {
            id: item.crmOrderId,
            create_date_time: item.sendFormDate,
            client_ids: String(item.ymId),
            ...(!!item.emails)? { emails: item.emails } : {},
            ...(!!item.phones)? { phones: item.phones } : {},
            ...(!!payId)? { client_uniq_id: String(payId)} : {},
            order_status: orderStatus,
            ...(!!sum) ? { revenue: sum} : {}
        }
    }

    private async getCustomerData(): Promise<CustomerResponseItems[]>{
        const customesData = await this.alfaService.getAlfaCustomesData();
        return this.filterCustomersData(customesData);
    }

    private filterCustomersData(data: CustomerResponseItems[]): CustomerResponseItems[]{
        return data.filter(item => /^\d+\nFormID:/.test(item.note))
    }

    private async formatCustomersData(data: CustomerResponseItems[]): Promise<FormatCustomerData[]>{
        const formatData: FormatCustomerData[] = [];
        for (const item of data) {
            const ymId = item.note.split('\n')[0];
            const payResponse = await this.alfaService.getAlfaPayData(item.id)
            formatData.push({
                clientId: item.id,
                name: item.name,
                phones: item.phone.map( (p: string) => p.replace(/\D/g, '')).join(','),
                emails: item.email.join(','),
                ymId,
                crmOrderId: `${item.id}_${ymId}`,
                sendFormDate: item.b_date,//moment(item.b_date).format('DD.MM.YYYY'),
                payInfo: (payResponse.length !== 0)? this.formatPayData(payResponse) : []
            })
        }
        return formatData;
    }
    
    private formatPayData(payData: PayResponseItems[]): FormatPayInfo[] {
        return payData.map( (p: PayResponseItems) => {
            return {
                id: p.id,
                sum: p.income,
                date: p.document_date
            }
        })
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