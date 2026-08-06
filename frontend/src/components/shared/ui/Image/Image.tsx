import type { ImgHTMLAttributes } from 'react';

export type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string;
};

export function Image({ src, alt = '', ...props }: ImageProps) {
  return <img src={src} alt={alt} {...props} />;
}
