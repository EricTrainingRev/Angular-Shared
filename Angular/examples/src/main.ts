import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app.config';
import { ExampleHome } from './app/1-example-home/example-home';

bootstrapApplication(ExampleHome, appConfig).catch((err) => console.error(err));
