import {fakeAsync, TestBed, tick} from "@angular/core/testing";
import {provideReporterInterceptor, ReporterModule} from "./reporter-module/reporter.module";
import {ReporterService} from "./reporter.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse, HttpEventType} from "@angular/common/http";
import {ReporterInterceptor} from "./interceptors/reporter.interceptor";

describe('Reporter management tests', () => {
  let reporterService: ReporterService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let interceptor: ReporterInterceptor;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReporterModule.forRoot({
          whitelist:{
            urls:[],
            codes:[418,500]
          },
          blacklist: {
            codes:[],
            urls:['http://example-blacklisted.com']
          }
        }),
        HttpClientTestingModule
      ],
      providers: [
        ReporterService,
        provideReporterInterceptor()
      ]
    })
    reporterService = TestBed.inject(ReporterService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    // @ts-ignore
    interceptor = TestBed.inject(HTTP_INTERCEPTORS).find((i: any) => i instanceof ReporterInterceptor );
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should get the service withe correct configuration', () => {
    expect(reporterService).toBeTruthy();
    expect(reporterService.configuration).toBeTruthy();
    const config = reporterService.configuration!;

    expect(config.blacklist).toBeTruthy();
    expect(config.blacklist.codes).toBeTruthy();
  });

  it('should throw an error if the configuration is missing', () => {
    TestBed.resetTestingModule();
    expect(() => {
      TestBed.configureTestingModule({
        imports: [
          ReporterModule,
        ],
        providers: [ReporterService]
      })
      reporterService = TestBed.inject(ReporterService);
    }).toThrowError();
  });

  it("should be toggle the interceptor on and check http responses", fakeAsync(() => {
    const mockedData = {message: 'Hello world'};
    httpClient.get('http://example.com').subscribe(data => {
      expect(data).toEqual(mockedData);
    });
    const req = httpMock.expectOne('http://example.com');
    expect(req.request.method).toBe('GET');
    req.flush(mockedData);
  }));

  it("should check the codes in the whitelist configuration", fakeAsync(() => {
    sendRequest(httpClient, httpMock, 'get', 'http://example.com?test=bite', 418,  {});
    spyOn(interceptor, 'intercept').and.callThrough();
    reporterService.getError().subscribe(error => {
      console.log(error)
      expect(error).toBeTruthy();
      expect(error[0]?.code).toBe(418);
      expect(error[0]?.request.url).toBe('http://example.com?test=bite');
      expect(error[0]?.request.payload).toBeNull();
    });
  }));

  it('should check the the codes int the whitelist configuration in a POST request', fakeAsync(() => {

    sendRequest(httpClient, httpMock, 'post', 'http://example.com', 500, {
      test1: 'test one',
      test2: 'test two'
    });
    spyOn(interceptor, 'intercept').and.callThrough();
    reporterService.getError().subscribe(error => {
      expect(error).toBeTruthy();
      expect(error[0]?.code).toBe(500);
      expect(error[0]?.request.url).toBe('http://example.com');
      expect(error[0]?.request.payload).toEqual({
        test1: 'test one',
        test2: 'test two'
      });
    });
  }))

  it('should not trigger an error if the code is not in the whitelist', fakeAsync(() => {
    sendRequest(httpClient, httpMock, 'get', 'http://example.com', 404, {});
    spyOn(interceptor, 'intercept').and.callThrough();
    reporterService.getError().subscribe(error => {
      expect(error).toEqual([]);
    });
  }));

  it('should not trigger an error if the url is blacklisted', fakeAsync(() => {
    sendRequest(httpClient, httpMock, 'get', 'http://example-blacklisted.com', 500, {});
    spyOn(interceptor, 'intercept').and.callThrough();
    reporterService.getError().subscribe(error => {
      expect(error).toEqual([]);
    });
  }));

  it('should get the latest error', fakeAsync(() => {
    sendRequest(httpClient, httpMock, 'get', 'http://example.com', 500, {});
    spyOn(interceptor, 'intercept').and.callThrough();
    const latest = reporterService.getLatestError();
    expect(latest).toBeTruthy();
  }))
});
const sendRequest = (httpClient: HttpClient, httpMock: HttpTestingController, method: string, url: string, status: number, payload: any) => {
  // @ts-ignore
  httpClient[method](url, payload).subscribe((data) => {
    return fail('Request should have failed with status : ' + status);
  }, (error: HttpErrorResponse) => {
    expect(error.status).toBe(status);
  });

  const req = httpMock.expectOne(url);
  expect(req.request.method).toBe(method.toUpperCase());
  req.flush('Error', {status, statusText: 'Error'});
  tick();
}
