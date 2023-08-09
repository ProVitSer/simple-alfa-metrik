import 'dotenv/config'
import axios from 'axios';
import { createObjectCsvWriter } from 'csv-writer';
import { FromatCustomersData } from 'src/alfacrm/interfaces/interface';
import * as FormData from 'form-data';
import * as fs from 'fs';


export class YandexMetrikaSimpleOrders {
    public async sendSimpleOrders(data: FromatCustomersData[]){
        await this.toCSV(data);
        const formData = this.formData();
        await this.request(formData)
    }

    private async request(form: FormData){
        try {
            const response = await axios.post(process.env.YANDEX_API_URL, form, { headers: this.getHeader(form) });
            console.log('Ответ от сервера:', response.data);
          } catch (error) {
            console.error('Произошла ошибка:', error.message);
          }
    }

    private getHeader(form: FormData){

        return {
            'Authorization': `OAuth ${process.env.YANDEX_AUTH}`, 
            'Content-Type': 'text/csv',
            ...form.getHeaders()
        }
    }

    private formData(): FormData {
        const form = new FormData();
        form.append('file', fs.createReadStream('output.csv'), { filename: 'output.csv' });
        return form;
      
    }

    private async toCSV(data: FromatCustomersData[]){
        const csvWriter = createObjectCsvWriter({
            path: 'output.csv',
            header: [{ id: 'id', title: 'id' }, { id: 'create_date_time', title: 'create_date_time'}, { id: 'note', title: 'client_ids' }],
          });
        
        await csvWriter.writeRecords(data);
    }

}