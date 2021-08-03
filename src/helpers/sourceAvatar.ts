import { BASE_API_IMAGES_CLOUDINNARY_SCALE, DEFAULT_AVATAR } from '../api';

export const SourceAvatar = (source: string) => {
  if (source) {
    if (source.indexOf('https://') !== -1) {
      return source;
    }

    return `${BASE_API_IMAGES_CLOUDINNARY_SCALE}/${source}`;
  }

  return `${BASE_API_IMAGES_CLOUDINNARY_SCALE}/${DEFAULT_AVATAR}`;
};
