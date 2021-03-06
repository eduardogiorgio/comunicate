// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // api key
  PIXABAY_API_KEY : "12955239-e5332629e890a804b6bf2a876",
  PIXABAY_API_URL: "https://pixabay.com/api/",
  // global images
  FOTO_IMAGE_DEFAULT: "./assets/images/camera-icon.png",
  ERROR_IMAGE_DEFAULT: "./assets/images/error-image.png"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
