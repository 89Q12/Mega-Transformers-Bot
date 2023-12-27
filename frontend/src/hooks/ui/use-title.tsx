import {} from 'react';

export const useTitle = (text: string | '') => {
  const emoji = '🐶';
  const originalTitle = 'Mega Transformers Bot';
  document.title =
    text !== ''
      ? `${emoji} ${text} - ${originalTitle}`
      : `${emoji} ${originalTitle}`;
};
