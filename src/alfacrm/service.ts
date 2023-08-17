import { AlfaCrm } from "./api";
import { ApiVersion, RESTUrlPath, ApiMethod } from "./interfaces/enum";
import { CustomerResponseItems, BaseResponse, PayResponseItems } from "./interfaces/interface";

export class AlfaService {
    public async getAlfaCustomesData(): Promise<CustomerResponseItems[]> {
        const alfaCrm = await AlfaCrm.factory();
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

    public async getAlfaPayData(customerId: number){
        const alfaCrm = await AlfaCrm.factory();
        const payItems: PayResponseItems[] = [];
        let countPay: number = 0;
        let page: number = 0;
        async function getPay(page: number){
            const response = await alfaCrm.request<BaseResponse<PayResponseItems>>(`${process.env.ALFACRM_URL}${ApiVersion.v2}${RESTUrlPath.pay}${ApiMethod.index}`, { page, customer_id: customerId });
            countPay += response.count;
            payItems.push(...response.items);
            if(countPay < response.total){
                page++;
                await getPay(page);
            }
    
        }
        await getPay(page);
        return payItems;
    }
    
}