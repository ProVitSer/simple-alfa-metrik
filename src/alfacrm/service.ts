import { AlfaCrm } from "./api";
import { ApiVersion, RESTUrlPath, ApiMethod } from "./interfaces/enum";
import { CustomerResponseItems, BaseResponse, PayResponseItems } from "./interfaces/interface";

export class AlfaService {
    public async getAlfaCustomesData(dateFrom: string): Promise<CustomerResponseItems[]> {
        return await this.requestByPage<CustomerResponseItems>(`${process.env.ALFACRM_URL}${ApiVersion.v2}${RESTUrlPath.customer}${ApiMethod.index}`, { date_from: dateFrom })
    }

    public async getAlfaPayData(dateFrom: string):Promise<PayResponseItems[]>{
        return await this.requestByPage<PayResponseItems>(`${process.env.ALFACRM_URL}${ApiVersion.v2}${RESTUrlPath.pay}${ApiMethod.index}`, { date_from: dateFrom })
    }

    public async getCustomerById(customerId: number): Promise<CustomerResponseItems[]> {
        const alfaCrm = await AlfaCrm.factory();
        const response = await alfaCrm.request<BaseResponse<CustomerResponseItems>>(`${process.env.ALFACRM_URL}${ApiVersion.v2}${RESTUrlPath.customer}${ApiMethod.index}`, { id: customerId });
        return response.items;
    }
    
    private async requestByPage<T>(urlPath: string, filter?: { [key: string]: any }): Promise<T[]>{
        const alfaCrm = await AlfaCrm.factory();
        const payItems: T[] = [];
        let count: number = 0;
        let page: number = 0;
        async function request(page: number){
            const response = await alfaCrm.request<BaseResponse<T>>(urlPath, { page, ...filter });
            count += response.count;
            payItems.push(...response.items);
            if(count < response.total){
                page++;
                await request(page);
            }
    
        }
        await request(page);
        return payItems;
    }
}