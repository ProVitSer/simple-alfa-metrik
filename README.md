# Simple AlfaCrm Yandex metrik script
A simple script for sending user data from AlfaCrm that has paid for courses in Yandex Metrika

# Environment Variables
Several environment variables must be set for the script to function properly

```
YANDEX_AUTH=Bearer AQAAAAAABTJzAAQXzv5
YANDEX_API_URL=https://api-metrika.yandex.net/stat/v1/data
ALFACRM_EMAIL=test@mail.ru
ALFACRM_API_KEY=test_uF6z9HFXuYyvf6MADnG41LHM9udXBitVLlBfD5Qv
ALFACRM_API_URL=https://test.ru/api/v1
```


# Installation

```
npm install
cp .env.example .env
npm run start
```