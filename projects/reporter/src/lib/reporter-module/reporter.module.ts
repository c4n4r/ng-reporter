import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import {CONFIG_TOKEN, ReporterService} from '../reporter.service';
import { ReporterConfiguration } from '../types/reporter-configuration.types';
import { reporterServiceFactory } from './factories/reporter-factory';
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {ReporterInterceptor} from "../interceptors/reporter.interceptor";

export const provideReporterInterceptor = () => {
  return {
    provide: HTTP_INTERCEPTORS,
    useClass: ReporterInterceptor,
    multi: true
  }
};

@NgModule({})
export class ReporterModule {
  static forRoot(config: ReporterConfiguration): ModuleWithProviders<ReporterModule> {
    return {
      ngModule: ReporterModule,
      providers: [
        {
          provide: ReporterService,
          useFactory: reporterServiceFactory,
          deps: [CONFIG_TOKEN]
        },
        {
          provide: CONFIG_TOKEN,
          useValue: config
        }
      ]
    };
  }
}
