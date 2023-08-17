import 'dotenv/config'
import axios, {  RawAxiosRequestHeaders } from 'axios';
import { ApiMethod, ApiVersion, RESTUrlPath } from './interfaces/enum';
import { BaseResponse, CustomerResponseItems, LoginRequestData, LoginresponseData } from './interfaces/interface';

export class AlfaCrm {
    private static url = process.env.ALFACRM_URL
    private readonly token: string;
    private readonly header: RawAxiosRequestHeaders;
    protected constructor(data: LoginresponseData){
        this.token = data.token
        this.header = {
            'X-ALFACRM-TOKEN': this.token,
          }
    }


    static async factory():Promise<AlfaCrm>{
        const response = await axios.post<LoginresponseData>(`${this.url}${ApiVersion.v2}${RESTUrlPath.login}`, this.getLoginInfo());
        return new AlfaCrm(response.data);
    }

    private static getLoginInfo(): LoginRequestData{
        return {
            email: process.env.ALFACRM_EMAIL,
            api_key: process.env.ALFACRM_API_KEY
        }
    }

    public async request<T>(urlPath: string, data: {[key: string]: any}): Promise<T>{
        try{
            const response =  await axios.post<LoginresponseData>(urlPath, data, { headers: this.header });
            return response.data as T
        }catch(e){
            throw e;
        }
    }
}