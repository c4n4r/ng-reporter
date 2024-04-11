import {ErrorResponse} from "../types/reporter-errors.types";
import {HttpErrorResponse, HttpRequest} from "@angular/common/http";
import {ErrorResponseAdapter} from "../adapters/error-response-adapter";

export default class RequestManager {

  static extractErrorResponseData(error: HttpErrorResponse, request: HttpRequest<any>): ErrorResponse {
    return ErrorResponseAdapter.adapt({request, error});
  }

}
