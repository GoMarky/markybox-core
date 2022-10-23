import appVersion from './app-version';
import vijuEmbedDevtoolPublicPath from './embed-devtool-publlc-path';
import isDev from './is-dev';
import vijuNativeDevtoolPublicPath from './native-devtool-public-path';
import outputPath from './output-path';
import playerPublicPath from './editor-public-path';
import port from './port';
import publicPath from './public-path';
import vijuSmartDevtoolPublicPath from './smart-devtool-public-path';

export const EnvironmentVariable = {
  PORT: port,
  APP_VERSION: appVersion,
  OUTPUT_PATH: outputPath,
  PLAYER_PUBLIC_PATH: playerPublicPath,
  NATIVE_DEVTOOL_PUBLIC_PATH: vijuNativeDevtoolPublicPath,
  EMBED_DEVTOOL_PUBLIC_PATH: vijuEmbedDevtoolPublicPath,
  SMART_DEVTOOL_PUBLIC_PATH: vijuSmartDevtoolPublicPath,
  PUBLIC_PATH: publicPath,
  IS_DEV: isDev,
};
