export const getAccessToken = async () => {
	try {
		const response = await fetch('https://auth.proptexx.com/_auth', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Apikey NmJjYWIzYTktYWZhMy00ZDdhLWIwNjQtYzAzZjFiOGVkOWNlfDAxMDc1ZDA5LTJiODgtNGYzNS1iZTE2LTg1ZjdjODYxNmI2MQ',
			},
			body: JSON.stringify({ scopes: {} }),
		});

		if (!response.ok) {
			throw new Error('Failed to authenticate');
		}

		const data = await response.json();
		return data?.$accessToken;
	} catch (error) {
		console.error('Error fetching access token:', error);
		return null;
	}
};