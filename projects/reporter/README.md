# NG-Error-Reporter

A simple library to report errors from http requests to a server.

## Minimum requirements

Angular 15.0.0

## Installation

```bash
npm install ng-error-reporter
```

## Usage

Import the RouterModule in your module and call the forRoot method with the configuration object.

```typescript
import {provideReporterInterceptor} from "./reporter.module";

@NgModule({
  imports: [
    // import the module with the correct configuration
    ReporterModule.forRoot({
      whitelist: {
        urls: [],
        codes: [500, 418]
      },
      blacklist:
        {
          urls: [],
          codes: []
        }
    })
  ],
  providers: [
    // Will add the reporter interceptor to the http requests
    provideReporterInterceptor()
  ],
})
```

After the module is imported and the interceptor is provided, the errors will be catched and sent to the application by the reporter service.

```typescript
import {ReporterService} from "./reporter.service";
import {ErrorResponse} from "./reporter-errors.types";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private reporter: ReporterService) {
    this.reporter.errors.subscribe((errors: ErrorResponse[]) => {
      // You can get the latest error from the reporter service if needed
      console.log(this.reporter.getLatestError()
    });
  }
}
```


## Configuration

The configuration object has two properties, whitelist and blacklist. Both properties have two properties, urls and codes. The urls property is an array of strings that will be used to match the url of the request. The codes property is an array of numbers that will be used to match the status code of the response.

The whitelist property will only report the errors that match the urls and codes. The blacklist property will report all errors except the ones that match the urls and codes.


## Types

### ErrorResponse

```typescript
export type ErrorResponse = {
  triggeredAt: Date;
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
```


## License

MIT
