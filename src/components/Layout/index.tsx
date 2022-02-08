import React from 'react';
import Head from 'next/head';

import * as S from './styled';
import Header from './Header';

interface LayoutProps {
	title: string;
	loggedInAddress?: string;
}

const Layout: React.FC<LayoutProps> = ({
	title,
	loggedInAddress,
	children,
}) => {
	return (
		<S.PageWrapper>
			<Head>
				<link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
				<title>{title}</title>
			</Head>
			<Header loggedInAddress={loggedInAddress} />
			<main>{children}</main>
		</S.PageWrapper>
	);
};

export default Layout;
