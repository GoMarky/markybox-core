enum SystemOS {
  MacOS = 'MacOS',
  Linux = 'Linux',
  Windows = 'Windows',
}

const systemOS = (() => {
  if (navigator.userAgent.indexOf('Win') !== -1) {
    return SystemOS.Windows;
  }
  if (navigator.userAgent.indexOf('Mac') !== -1) {
    return SystemOS.MacOS;
  }

  if (navigator.userAgent.indexOf('Linux') !== -1 || navigator.userAgent.indexOf('X11') !== -1) {
    return SystemOS.Linux;
  }
})();

export const isWindows = systemOS === SystemOS.Windows;
export const isMac = systemOS === SystemOS.MacOS;
export const isLinux = systemOS === SystemOS.Linux;
