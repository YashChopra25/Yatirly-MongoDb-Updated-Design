export type ThemeType = 'dark' | 'light';
export type ColorScheme = 'purple' | 'blue' | 'green' | 'rose' | 'orange';

interface ThemeColors {
  primary: {
    from: string;
    to: string;
    text: string;
    hover: string;
  };
  background: {
    start: string;
    end: string;
  };
  card: {
    background: string;
    border: string;
    hover: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
}

type ThemeConfig = {
  [key in ThemeType]: {
    [scheme in ColorScheme]: ThemeColors;
  };
};

export const themes: ThemeConfig = {
  dark: {
    purple: {
      primary: {
        from: '#635bc9',
        to: '#8b84e5',
        text: '#cfcde4',
        hover: '#7367d6',
      },
      background: {
        start: '#1a1d2d',
        end: '#25293c',
      },
      card: {
        background: '#2a2f45',
        border: '#44485e',
        hover: '#363b54',
      },
      text: {
        primary: '#cfcde4',
        secondary: '#cfcde4',
      },
    },
    blue: {
      primary: {
        from: '#2563eb',
        to: '#3b82f6',
        text: '#e2e8f0',
        hover: '#1d4ed8',
      },
      background: {
        start: '#0f172a',
        end: '#1e293b',
      },
      card: {
        background: '#1e293b',
        border: '#334155',
        hover: '#334155',
      },
      text: {
        primary: '#e2e8f0',
        secondary: '#cbd5e1',
      },
    },
    green: {
      primary: {
        from: '#059669',
        to: '#10b981',
        text: '#d1fae5',
        hover: '#047857',
      },
      background: {
        start: '#064e3b',
        end: '#065f46',
      },
      card: {
        background: '#065f46',
        border: '#047857',
        hover: '#047857',
      },
      text: {
        primary: '#ecfdf5',
        secondary: '#d1fae5',
      },
    },
    rose: {
      primary: {
        from: '#e11d48',
        to: '#f43f5e',
        text: '#ffe4e6',
        hover: '#be123c',
      },
      background: {
        start: '#881337',
        end: '#9f1239',
      },
      card: {
        background: '#9f1239',
        border: '#be123c',
        hover: '#be123c',
      },
      text: {
        primary: '#fff1f2',
        secondary: '#ffe4e6',
      },
    },
    orange: {
      primary: {
        from: '#ea580c',
        to: '#f97316',
        text: '#ffedd5',
        hover: '#c2410c',
      },
      background: {
        start: '#7c2d12',
        end: '#9a3412',
      },
      card: {
        background: '#9a3412',
        border: '#c2410c',
        hover: '#c2410c',
      },
      text: {
        primary: '#fff7ed',
        secondary: '#ffedd5',
      },
    },
  },
  light: {
    purple: {
      primary: {
        from: '#635bc9',
        to: '#8b84e5',
        text: '#1a1d2d',
        hover: '#7367d6',
      },
      background: {
        start: '#ffffff',
        end: '#f3f4f6',
      },
      card: {
        background: '#ffffff',
        border: '#e5e7eb',
        hover: '#f3f4f6',
      },
      text: {
        primary: '#1f2937',
        secondary: '#4b5563',
      },
    },
    blue: {
      primary: {
        from: '#2563eb',
        to: '#3b82f6',
        text: '#1e293b',
        hover: '#1d4ed8',
      },
      background: {
        start: '#ffffff',
        end: '#f1f5f9',
      },
      card: {
        background: '#ffffff',
        border: '#e2e8f0',
        hover: '#f1f5f9',
      },
      text: {
        primary: '#0f172a',
        secondary: '#334155',
      },
    },
    green: {
      primary: {
        from: '#059669',
        to: '#10b981',
        text: '#064e3b',
        hover: '#047857',
      },
      background: {
        start: '#ffffff',
        end: '#f0fdf4',
      },
      card: {
        background: '#ffffff',
        border: '#dcfce7',
        hover: '#f0fdf4',
      },
      text: {
        primary: '#064e3b',
        secondary: '#047857',
      },
    },
    rose: {
      primary: {
        from: '#e11d48',
        to: '#f43f5e',
        text: '#881337',
        hover: '#be123c',
      },
      background: {
        start: '#ffffff',
        end: '#fff1f2',
      },
      card: {
        background: '#ffffff',
        border: '#ffe4e6',
        hover: '#fff1f2',
      },
      text: {
        primary: '#881337',
        secondary: '#9f1239',
      },
    },
    orange: {
      primary: {
        from: '#ea580c',
        to: '#f97316',
        text: '#7c2d12',
        hover: '#c2410c',
      },
      background: {
        start: '#ffffff',
        end: '#fff7ed',
      },
      card: {
        background: '#ffffff',
        border: '#ffedd5',
        hover: '#fff7ed',
      },
      text: {
        primary: '#7c2d12',
        secondary: '#9a3412',
      },
    },
  },
}; 