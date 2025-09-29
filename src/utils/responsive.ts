import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Breakpoints for responsive design
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  large: 1200,
} as const;

// Screen size utilities
export const getScreenWidth = () => Dimensions.get('window').width;
export const getScreenHeight = () => Dimensions.get('window').height;

// Responsive utilities
export const isSmallScreen = () => screenWidth < BREAKPOINTS.mobile;
export const isMobileScreen = () => screenWidth < BREAKPOINTS.tablet;
export const isTabletScreen = () => screenWidth >= BREAKPOINTS.tablet && screenWidth < BREAKPOINTS.desktop;
export const isDesktopScreen = () => screenWidth >= BREAKPOINTS.desktop;
export const isLargeScreen = () => screenWidth >= BREAKPOINTS.large;

// Responsive values helper
export const responsive = <T>(values: {
  mobile?: T;
  tablet?: T;
  desktop?: T;
  default: T;
}): T => {
  if (isDesktopScreen() && values.desktop !== undefined) {
    return values.desktop;
  }
  if (isTabletScreen() && values.tablet !== undefined) {
    return values.tablet;
  }
  if (isMobileScreen() && values.mobile !== undefined) {
    return values.mobile;
  }
  return values.default;
};

// Responsive spacing
export const responsiveSpacing = (base: number) => ({
  mobile: base,
  tablet: base * 1.2,
  desktop: base * 1.5,
});

// Responsive font sizes
export const responsiveFontSize = (base: number) => ({
  mobile: base,
  tablet: base * 1.1,
  desktop: base * 1.2,
});

// Container max width for different screen sizes
export const getContainerMaxWidth = () => {
  if (isDesktopScreen()) return 800;
  if (isTabletScreen()) return 600;
  return '100%';
};

// Responsive padding based on screen size
export const getResponsivePadding = () => responsive({
  mobile: 16,
  tablet: 24,
  desktop: 32,
  default: 16,
});

// Grid columns based on screen size
export const getGridColumns = () => responsive({
  mobile: 1,
  tablet: 2,
  desktop: 3,
  default: 1,
});

// Button width for different screens
export const getButtonWidth = () => {
  if (isDesktopScreen()) return 350;
  if (isTabletScreen()) return 300;
  return '100%';
};

// Form width for different screens
export const getFormWidth = () => {
  if (isDesktopScreen()) return '60%';
  if (isTabletScreen()) return '80%';
  return '100%';
};

// Web-specific responsive styles
export const getWebContainerStyle = () => {
  if (Platform.OS !== 'web') return {};
  
  return {
    maxWidth: getContainerMaxWidth(),
    marginHorizontal: 'auto',
    width: '100%',
  };
};

// Responsive card grid
export const getCardGridStyle = () => {
  const columns = getGridColumns();
  const padding = getResponsivePadding();
  
  return {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginHorizontal: -padding / 2,
    gap: isDesktopScreen() ? 16 : 8,
  };
};

// Responsive card item
export const getCardItemStyle = () => {
  const columns = getGridColumns();
  const padding = getResponsivePadding();
  
  return {
    width: `${100 / columns}%`,
    paddingHorizontal: padding / 2,
    marginBottom: padding,
    minWidth: columns > 1 ? 250 : undefined,
  };
};
