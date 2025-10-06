// src/styles/galleryStyles.ts

export function getToneColor(tone: string) {
    switch (tone) {
      case 'reflective':
        return { bg: '#DBEAFE', text: '#1E3A8A' };
      case 'warm':
        return { bg: '#FEF3C7', text: '#92400E' };
      case 'minimal':
        return { bg: '#F3F4F6', text: '#374151' };
      default:
        return { bg: '#F0F0F0', text: '#666666' };
    }
  }
  
  export const galleryStyles: Record<string, React.CSSProperties> = {
    gallery: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '2rem',
      padding: '2rem',
    },
    card: {
      cursor: 'pointer',
      background: '#fff',
      borderRadius: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      padding: '1.25rem',
      transition: 'transform 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    thumbPlaceholder: {
      width: '100%',
      height: '180px',
      borderRadius: '12px',
      marginBottom: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.9rem',
      fontWeight: 500,
    },
    title: {
      fontSize: '1.2rem',
      fontWeight: 600,
      margin: '0.5rem 0',
      textAlign: 'center',
    },
    description: {
      fontSize: '1rem',
      color: '#666',
      textAlign: 'center',
    },
    loading: {
      padding: '2rem',
      fontSize: '1rem',
      textAlign: 'center',
    },
  };
  