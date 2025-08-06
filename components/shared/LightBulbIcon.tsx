
import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {}

const LightBulbIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.355a7.5 7.5 0 01-4.5 0m4.5 0v.75A2.25 2.25 0 0112 21h-.003c-1.241 0-2.25-.99-2.25-2.205v-.653m3.75-15.045a7.5 7.5 0 00-7.5 0M12 3v2.25A6.75 6.75 0 0112 18a6.75 6.75 0 010-12.75V3z" />
  </svg>
);

export default LightBulbIcon;