import {ReporterConfiguration} from "../../types/reporter-configuration.types";
import {ReporterService} from "../../reporter.service";

export function reporterServiceFactory(config: ReporterConfiguration) {
  return new ReporterService(config);
}
