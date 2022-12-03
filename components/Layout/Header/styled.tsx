import styled from 'styled-components';
import Link from 'next/link'

export const HeaderWrapper = styled.header`
	background: ${({ theme }) => theme.colors.blue};
	border-bottom: 1px solid ${({ theme }) => theme.colors.blueDark};
	padding: 0.75rem 0;
	margin-bottom: 2rem;
`;

export const HomeLink = styled(Link)`
	cursor: pointer;
	color: ${({ theme }) => theme.colors.textAlt} !important;
	font-size: 1.25rem;
	font-weight: bold;
`;