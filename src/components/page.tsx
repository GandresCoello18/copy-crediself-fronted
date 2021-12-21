/* eslint-disable react/display-name */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, forwardRef } from 'react';
import { Helmet } from 'react-helmet';

interface Props {
  children: ReactNode;
  title: string;
  className: any;
}

const Page = forwardRef(({ children, title, className }: Props, ref: any) => {
  return (
    <div ref={ref} className={className}>
      <Helmet>
        <title>{title} | Dashboard</title>
        {localStorage.getItem('empresa-hass-user')?.includes('CREDISELF') && (
          <link
            rel='icon'
            href='https://res.cloudinary.com/cici/image/upload/v1627948680/util/logo-crediself_jtbifz.png'
          />
        )}
        {localStorage.getItem('empresa-hass-user')?.includes('AUTOIMPULZADORA') && (
          <link
            rel='icon'
            href='https://res.cloudinary.com/cici/image/upload/v1629240101/util/WhatsApp_Image_2021-03-04_at_2.09.52_PM_2_mvg89p.jpg'
          />
        )}
      </Helmet>
      {children}
    </div>
  );
});

export default Page;
