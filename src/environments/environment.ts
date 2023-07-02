// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   apiUrl: 'https://localhost:5001',
//   exploreurl: 'https://localhost:5072',
//   authorityUrl: 'https://localhost:5001',
//   notificationUrl: 'https://localhost:5044',
//   postUrl: 'https://localhost:5201',
//   clientId: 'together_we_go_angular_client',
//   clientUrl: 'https://localhost:4200',
//   scope: 'openid profile email roles together_we_go_api.read together_we_go_api.write'
// };

export const environment = {
  production: false,
  apiUrl: 'http://23.102.92.127:8081',
  exploreurl: 'http://23.102.92.127:8085',
  authorityUrl: 'http://23.102.92.127:8081',
  notificationUrl: 'http://20.210.207.194:8087',
  postUrl: 'http://20.210.207.194:8083',
  clientId: 'together_we_go_angular_client',
  clientUrl: 'https://localhost:4200',
  scope: 'openid profile email roles together_we_go_api.read together_we_go_api.write'
};