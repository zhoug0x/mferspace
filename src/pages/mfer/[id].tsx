import React from 'react';

import { getMfer } from '../../services/mfer.service';
import { getProfile } from '../../services/profile.service';
import { useAuthContext } from '../../contexts/AuthContext';

import { Container } from '../../components/Shared';
import Layout from '../../components/Layout';
import ProfileCard from '../../components/ProfileCard';
import AttributesCard from '../../components/AttributesCard';
import BlurbSection from '../../components/BlurbSection';

const ProfilePage: React.FC = ({ mfer, profile, error }: any) => {
	const { login, logout } = useAuthContext();

	if (error) return <h1>server error - check server console</h1>;
	if (!mfer) return <h1>no mfer... server error! pls report lol</h1>;

	return (
		<Layout title={`${mfer.name} | mferspace`}>
			<Container>
				<div style={{ display: 'flex' }}>
					<div>
						<ProfileCard mfer={mfer} profile={profile} />
						<AttributesCard attributes={mfer.attributes} />
						<BlurbSection name={mfer.name} />
					</div>
				</div>
			</Container>
		</Layout>
	);
};

export const getServerSideProps = async ({ query: { id } }: any) => {
	try {
		// param input validation
		// (mfer ids can range from 0 to 10020)
		const mferId = parseInt(id);
		if (mferId === NaN) {
			throw Error('Invalid ID param - numbers only');
		}
		if (mferId < 0 || mferId > 10020) {
			throw Error('No mfers at requested ID - values between 0 - 10020 only');
		}

		const [mfer, profile] = await Promise.all([
			getMfer(mferId),
			getProfile(mferId),
		]);

		return { props: { mfer, profile, error: false } };
	} catch (error) {
		console.error(error);
		return { props: { error: true } };
	}
};

export default ProfilePage;
