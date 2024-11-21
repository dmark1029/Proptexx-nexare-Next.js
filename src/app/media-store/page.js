import React from "react";
import VirtualStagingContent from "@/components/VirtualStagingContent";
import { headers } from 'next/headers';

async function getToken(url, host) {
  let formData = {};
  if (host.includes('ilist')) {
    formData = {
      "grant_type": "client_credentials",
      "client_id": "419BA8A7-D770-4EB9-9248-01559A95C9F5",
      "client_secret": "EEACCAEB-4980-4BB4-A852-D18259F7AEAD"
    }

    const response = await fetch(url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();
    if (data.access_token) {
      return data.access_token;
    } else {
      console.error('An error occurred in generating tokens')
    }
  }
  else {
    let apiProviderID = '';
    let code = '';

    switch (true) {
      case host.includes('exp'):
        apiProviderID = process.env.NEXT_PUBLIC_EXP_API_PROVIDER_ID;
        code = process.env.NEXT_PUBLIC_EXP_CODE;
        break;
      case host.includes('viking'):
        apiProviderID = process.env.NEXT_PUBLIC_VIKING_API_PROVIDER_ID;
        code = process.env.NEXT_PUBLIC_VIKING_CODE;
        break;
      case host.includes('kwcp'):
        apiProviderID = process.env.NEXT_PUBLIC_KWCP_API_PROVIDER_ID;
        code = process.env.NEXT_PUBLIC_KWCP_CODE;
        break;
      case host.includes('cb'):
        apiProviderID = process.env.NEXT_PUBLIC_CB_API_PROVIDER_ID;
        code = process.env.NEXT_PUBLIC_CB_CODE;
        break;
      case host.includes('c21'):
        apiProviderID = process.env.NEXT_PUBLIC_C21_API_PROVIDER_ID;
        code = process.env.NEXT_PUBLIC_C21_CODE;
        break;
      case host.includes('realsmart'):
        apiProviderID = process.env.NEXT_PUBLIC_REALSMART_API_PROVIDER_ID;
        code = process.env.NEXT_PUBLIC_REALSMART_CODE;
        break;
      case host.includes('realty'):
        apiProviderID = process.env.NEXT_PUBLIC_REALTY_API_PROVIDER_ID;
        code = process.env.NEXT_PUBLIC_REALTY_CODE;
        break;
      default:
        console.warn('No matching provider found.');
    }

    formData = {
      "apiProviderID": apiProviderID,
      "code": code,
    }

    const response = await fetch(url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();
    if (data.response?.result) {
      return data.response?.result;
    } else {
      console.error('An error occurred in generating tokens')
    }
  }
}

const MediaStore = async () => {
  const currentHeaders = headers();
  const host = currentHeaders.get('host'); // Get the host name
  let reqTokenUrl = '';

  if (host.includes('ilist')) {
    reqTokenUrl = 'https://api.goiconnect.com/api/OAuth/GetToken';
  } else {
    reqTokenUrl = 'https://api.realestateplatform.com/api/Account/ApiAuthenticate';
  }
  const token = await getToken(reqTokenUrl, host);
  return (
    <VirtualStagingContent crmToken={token} />
  );
};

export default MediaStore;
