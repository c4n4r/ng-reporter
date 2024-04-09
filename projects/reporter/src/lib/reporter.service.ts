import {Inject, Injectable, InjectionToken} from '@angular/core';
import {ReporterConfiguration} from "./types/reporter-configuration.types";
import {BehaviorSubject} from "rxjs";
import {ErrorResponse} from "./types/reporter-errors.types";

export const CONFIG_TOKEN = new InjectionToken<ReporterConfiguration>('config');

@Injectable()
export class ReporterService {

  // create a behavior subject to store to trigger errors
  private errorSubject = new BehaviorSubject<ErrorResponse | null>(null);
  private error$ = this.errorSubject.asObservable();

  configuration: ReporterConfiguration | null  = null;

  constructor(@Inject(CONFIG_TOKEN) configuration: ReporterConfiguration) {
    this.configuration = configuration;
    this.checkConfiguration();
  }

// create a method to trigger errors
  triggerError(message: ErrorResponse){
    this.errorSubject.next(message);
  }
  getError(){
    return this.error$;
  }

  getLatestError(){
    return this.errorSubject.value;
  }

  private checkConfiguration(){
    ['blacklist', 'whitelist'].forEach(key => {
      if(!this.configuration) throw new Error('Configuration is required');
      // @ts-ignore
      if(!this.configuration?.[key]) throw new Error(`${key} is required`);
    });
  }

}
