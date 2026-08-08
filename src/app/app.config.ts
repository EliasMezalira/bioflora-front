import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    // 1. Fornece as animações nativamente
    provideAnimations(),
    // 2. Fornece o Toastr sem usar o .forRoot() antigo
    provideToastr({
      positionClass: 'toast-bottom-right',
      closeButton: true,
      progressBar: true
    }),
    importProvidersFrom(
      CoreModule,
      SharedModule,
      NgbModule
    )
  ]
};
