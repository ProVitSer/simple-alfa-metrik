import { CronJob } from 'cron';
import { AppService } from './app.service';


async function main() {
    try {

        const appService = new AppService();
        await appService.sendCustomerInfoToMetrika();

        // If you want to run the function every day at 7:00 AM, you can use the following code
        // const job = new CronJob(
        //     '0 7 * * *',
        //     async () =>  {
        //         const appService = new AppService();
        //         await appService.sendCustomerInfoToMetrika();
        //     })
        // job.start();
    }catch(e){
        console.log(e)
    }
}
main();