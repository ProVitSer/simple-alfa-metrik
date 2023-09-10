import { CronJob } from 'cron';
import { AppService } from './app.service';


async function main() {
    try {
        const job = new CronJob(
            '0 7 * * *',
            async () =>  {
                const appService = new AppService();
                await appService.sendCustomerInfoToMetrika();
            })
        job.start();
    }catch(e){
        console.log(e)
    }
}
main();