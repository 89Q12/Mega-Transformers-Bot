import {} from 'react';

export const useTitle = (text: string | '') => {
  const emoji = '🐶';
  const originalTitle = 'Cardinal System';
  document.title =
    text !== ''
      ? `${emoji} ${text} - ${originalTitle}`
      : `${emoji} ${originalTitle}`;
};
