"use client";
import { LinkedInCallback } from 'react-linkedin-login-oauth2';

function LinkedInCallbackPage() {
    const handleSuccess = (data) => {
        console.log('LinkedIn Auth Successful:', authData);

    };

    const handleError = (error) => {
        console.log('LinkedIn Auth Error:', error);
    }

    return <LinkedInCallback onSuccess={handleSuccess} onError={handleError} />;
}

export default LinkedInCallbackPage;