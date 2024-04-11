import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpHandler, HttpRequest} from "@angular/common/http";
import {catchError} from "rxjs";
import {ReporterService} from "../reporter.service";
import RequestManager from "../managers/request.manager";

@Injectable()
export class ReporterInterceptor {

  constructor(private reporterService: ReporterService) {}

  intercept(request: HttpRequest<never>, next: HttpHandler) {
    return next.handle(request).pipe(
  catchError((error: HttpErrorResponse) => {
    if(this.shouldReportError(request, error)) this.reporterService.triggerError(RequestManager.extractErrorResponseData(error, request));
    throw error;
  }));
  }

  private shouldReportError(request: HttpRequest<never>, error: HttpErrorResponse): boolean {
    return !this.isUrlBlacklisted(request.url)  &&  this.isCodeInWhitelist(error.status);
  }

  private isCodeInWhitelist(code: number): boolean {
    return this.reporterService.configuration?.whitelist.codes.includes(code) ?? false;
  }

  private isUrlBlacklisted(url: string): boolean {
    return this.reporterService.configuration?.blacklist.urls.includes(url) ?? false;
  }

}
