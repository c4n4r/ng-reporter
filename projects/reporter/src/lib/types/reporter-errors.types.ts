export type ErrorResponse = {
  code: number;
  message: string;
  others: any;
  request: ReporterErrorRequest;
}

export type ReporterErrorRequest = {
  url: string;
  method: string;
  payload: any;
  params: any;
}
