import NextLink from 'next/link';
import React from 'react';

interface Props {
  children: JSX.Element;
  href?: string;
}

// Checks whether a link is internal or external.
// If the link is internal, it uses NextLink.
// Otherwise it uses a normal a tag.
export const LinkWrap = ({ children, href }: Props) => {
  const useNextLink = !!href && !href.startsWith('http');

  if (useNextLink) {
    return (
      <NextLink href={href} passHref>
        {children}
      </NextLink>
    );
  }

  return React.cloneElement(children, { href });
};
