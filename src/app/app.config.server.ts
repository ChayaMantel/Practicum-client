import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';

import { appConfig } from './app.config';
import { DatePipe } from '@angular/common';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),DatePipe
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
function provideServerRendering(): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
    throw new Error('Function not implemented.');
}

