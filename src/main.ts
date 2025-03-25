import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {registerLicense} from '@syncfusion/ej2-base';
import { AppModule } from './app/app.module';

registerLicense("Ngo9BigBOggjHTQxAR8/V1NMaF1cXmhKYVB3WmFZfVtgcV9GaVZRRmY/P1ZhSXxWdkZhXX5ZcH1VRGZUVkI=");
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
