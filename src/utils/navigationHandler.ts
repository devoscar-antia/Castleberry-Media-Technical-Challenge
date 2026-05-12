// Global navigation handler for use outside React components
// Used primarily for notification tap handling

let navigateFunction: ((path: string) => void) | null = null;

export const setNavigateFunction = (navigate: (path: string) => void) => {
  navigateFunction = navigate;
  console.log('📍 Navigation function registered');
};

export const navigateTo = (path: string) => {
  console.log('📍 navigateTo called with path:', path);
  
  if (navigateFunction) {
    console.log('📍 Using React Router navigation');
    navigateFunction(path);
  } else {
    // Fallback: use window.location for cases where React isn't ready
    console.log('📍 Fallback: using window.location');
    window.location.href = path;
  }
};

export const isNavigationReady = (): boolean => {
  return navigateFunction !== null;
};
