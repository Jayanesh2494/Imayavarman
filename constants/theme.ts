export const theme = {
  colors: {
    // Primary - Red
    primary: '#E53935',
    primaryDark: '#C62828',
    primaryLight: '#EF5350',
    
    // Secondary - White & Gray
    secondary: '#FFFFFF',
    secondaryDark: '#F5F5F5',
    secondaryLight: '#FAFAFA',
    
    // Accent
    accent: '#D32F2F',
    
    // Background
    background: '#FFFFFF',
    backgroundSecondary: '#F8F8F8',
    backgroundDark: '#F0F0F0',
    
    // Text
    text: '#212121',
    textSecondary: '#666666',
    textLight: '#999999',
    textWhite: '#FFFFFF',
    
    // Status Colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Attendance Status
    present: '#4CAF50',
    absent: '#F44336',
    late: '#FF9800',
    
    // Borders & Dividers
    border: '#E0E0E0',
    divider: '#EEEEEE',
    
    // Shadows
    shadow: 'rgba(229, 57, 53, 0.15)',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  
  typography: {
    fontSize: {
      xs: 10,
      sm: 12,
      md: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    fontWeight: {
      regular: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  },
  
  shadows: {
    small: {
      shadowColor: '#E53935',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#E53935',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#E53935',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;
