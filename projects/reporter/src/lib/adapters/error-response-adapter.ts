import {HttpErrorResponse, HttpParams, HttpRequest} from "@angular/common/http";
import {ErrorResponse} from "../types/reporter-errors.types";
import BaseAdapter from "./base-adapter.interface";

export type ErrorResponseAdapterInput = {
  request: HttpRequest<any>;
  error: HttpErrorResponse;
}

export class ErrorResponseAdapter implements BaseAdapter<ErrorResponseAdapterInput, ErrorResponse>{
  adapt(input: ErrorResponseAdapterInput): ErrorResponse{
    return {
      triggeredAt: new Date(),
      code: input.error.status,
      message: input.error.statusText,
      others: input.error.error,
      request: {
        url: input.request.url,
        method: input.request.method,
        payload: input.request.body ?? null,
        params: this.extractParams(input.request.url)
      }
    };
  }

  private extractParams(url: string): any{

    const urlParams = new HttpParams({fromString: url.split('?')[1]});
    return urlParams.keys().reduce((acc, key) => {
      // @ts-ignore
      acc[key] = urlParams.get(key);
      return acc;
    }, {});
  }

  static adapt(input: ErrorResponseAdapterInput): ErrorResponse{
    return new ErrorResponseAdapter().adapt(input);
  }
}
