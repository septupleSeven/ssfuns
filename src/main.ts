import { WebGL } from "three/examples/jsm/Addons.js";
import App from "./js/App";
import { ErrorScreen } from "./js/utils/ErrorScreen";

const app = async () => {
  await App();
};

if (WebGL.isWebGL2Available()) {
  await app();
} else {
  const errorScreen = new ErrorScreen();
  errorScreen.removeContents();
  errorScreen.showErrorScreen();
}
