import { createObjectCsvWriter } from 'csv-writer';
import * as fs from 'fs';
import * as FormData from 'form-data';
import { YandexMetrika } from './api';
import { YMSendSimpleOrdersData } from './interfaces/interface';
import * as moment from 'moment';
import { join } from 'path';

export class YandexMetrikaService {
    private readonly ym: YandexMetrika = new YandexMetrika();

    public async sendSimpleOrders(data: YMSendSimpleOrdersData[]){
        const csvFileName = `ym-${moment().format('DD.MM.YYYY')}.csv`;        
        await this.toCSV(data, csvFileName);
        const formData = this.formData(csvFileName);
        await this.ym.request(formData)
    }

    private formData(fileName: string): FormData {
        const form = new FormData();
        form.append('file', fs.createReadStream(`${join(__dirname, '../../files/')}${fileName}`), { filename: fileName });
        return form;
      
    }

    private async toCSV(data: YMSendSimpleOrdersData[], fileName: string){
        const csvWriter = createObjectCsvWriter({
            path:  `${join(__dirname, '../../files/')}${fileName}`,
            header: [
                { id: 'id', title: 'id' }, 
                { id: 'create_date_time', title: 'create_date_time'}, 
                { id: 'client_ids', title: 'client_ids' }, 
                { id: 'order_status', title: 'order_status' },
                { id: 'emails', title: 'emails' },
                { id: 'phones', title: 'phones' },
                { id: 'client_uniq_id', title: 'client_uniq_id' },
                { id: 'revenue', title: 'revenue' }
            ],
          });
        
        await csvWriter.writeRecords(data);
    }
}