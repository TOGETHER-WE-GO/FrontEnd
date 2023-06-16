// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001',
  exploreurl: 'https://localhost:5072',
  authorityUrl: 'https://localhost:5001',
  notificationUrl: 'https://localhost:5044',
  postUrl: 'https://localhost:5201',
  clientId: 'together_we_go_angular_client',
  clientUrl: 'https://localhost:4200',
  scope: 'openid profile email roles together_we_go_api.read together_we_go_api.write'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
