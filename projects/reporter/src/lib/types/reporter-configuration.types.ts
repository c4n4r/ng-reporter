export type Configuration = {
  urls: string[];
  codes: number[];
}

export type ReporterConfiguration = {
  blacklist: Configuration;
  whitelist: Configuration;
}
