import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests/browser',timeout:90000,workers:1,use:{baseURL:'http://127.0.0.1:5190',headless:true,viewport:{width:1365,height:900},screenshot:'only-on-failure'},webServer:{command:'npm run dev -- --port 5190',url:'http://127.0.0.1:5190',reuseExistingServer:true},reporter:[['list'],['json',{outputFile:'test-results/report.json'}]]});

