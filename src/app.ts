import { AlfaCrm } from "./alfacrm";
import 'dotenv/config'
import { ApiMethod, ApiVersion, RESTUrlPath } from "./alfacrm/interfaces/enum";
import { BaseResponse, CustomerResponseItems, FromatCustomersData } from "./alfacrm/interfaces/interface";
import { YandexMetrikaSimpleOrders } from "./yandex";
import * as moment from 'moment';

async function main() {
    const alfaCrm = await AlfaCrm.factory();
    const customersData = await getAlfaCustomesData(alfaCrm);
    const formatCustomers = filterCustomersData(formatCustomersData(customersData));
    if(formatCustomers.length == 0) return;
    await new YandexMetrikaSimpleOrders().sendSimpleOrders(formatCustomers);
}

async function getAlfaCustomesData(alfaCrm: AlfaCrm): Promise<CustomerResponseItems[]> {
    const customerItems: CustomerResponseItems[] = [];
    let countCustomer: number = 0;
    let page: number = 0;
    async function getCustomer(page: number){
        const response = await alfaCrm.request<BaseResponse<CustomerResponseItems>>(`${process.env.ALFACRM_URL}${ApiVersion.v2}${RESTUrlPath.customer}${ApiMethod.index}`, { page });
        countCustomer += response.count;
        customerItems.push(...response.items);
        if(countCustomer < response.total){
            page++;
            await getCustomer(page);
        }

    }
    await getCustomer(page);
    return customerItems;
}

function formatCustomersData(data: CustomerResponseItems[]): FromatCustomersData[]{
    return data.map(item => {
        return { id: item.id, note: item.note};
      })
}

function filterCustomersData(data: FromatCustomersData[]): FromatCustomersData[]{
    return data.filter(item => /^\d+\nFormID:/.test(item.note)).map( item => {
        const extractedValue = item.note.split('\n')[0];
        return { id: item.id, note: extractedValue, create_date_time: moment().format('DD.MM.YYYY') };
      });
}

main();