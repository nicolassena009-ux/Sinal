import {defineConfig} from '@playwright/test';
import base from './playwright.config';
export default defineConfig({...base,timeout:150000,use:{...base.use,baseURL:'http://127.0.0.1:5191',channel:'chrome'},webServer:{command:'npm run dev -- --port 5191 --strictPort',url:'http://127.0.0.1:5191',reuseExistingServer:true}});
