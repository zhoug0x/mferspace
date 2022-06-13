import { NONCE_ENDPOINT, VERIFICATION_ENDPOINT } from '../config/constants';

const useAuth = () => {

	// TODO: type arg as Ethers.js signer
	const login = async (signer: any) => {
		try {
			const signerAddress = await signer.getAddress();

			// Fetch user nonce from DB (if no DB record exists for user, one will be generated by backend)
			const nonceResult = await fetch(NONCE_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ address: signerAddress }),
			}).then(res => res.json());

			// Sign fetched nonce with connected address
			const signature = await signer.signMessage(nonceResult.nonce.toString());

			// Send signature to server for verification
			const authResult = await fetch(VERIFICATION_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ address: signerAddress, signature }),
			}).then(res => res.json());

			// If auth successful, drop an address tracking cookie on client with an expiry one minute before the http-only token cookie
			if (!authResult.ok) {
				alert('Login attempt unsuccessful...');
			}
		} catch (error: any) {
			// If user rejects connect request, just return silently
			if (error.code === 4001) return;

			console.error(error);
			alert('Error authenicating - check console for error details...');
		}
	};

	return { login };
};

export default useAuth;
