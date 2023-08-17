import 'dotenv/config'
import axios from 'axios';
import * as FormData from 'form-data';


export class YandexMetrika {
    public async request(form: FormData){
        try {
            const response = await axios.post(process.env.YANDEX_API_URL, form, { headers: this.getHeader(form) });
            console.log('Ответ от сервера:', response.data);
          } catch (error) {
            console.error('Произошла ошибка:', error);
          }
    }

    private getHeader(form: FormData){

        return {
            'Authorization': `OAuth ${process.env.YANDEX_AUTH}`, 
            'Content-Type': 'text/csv',
            ...form.getHeaders()
        }
    }
}