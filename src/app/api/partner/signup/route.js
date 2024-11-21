import { headers } from 'next/headers';
export const dynamic = "force-dynamic";

export async function POST(request) {
  let partnerToken = '';
  let name = '';
  let email = '';
  let country_code = '';
  let language_code = '';
  let region_id = '';
  let tenant_id = '';
  let typeOfBusiness = '';
  let type = '';

  try {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);

    partnerToken = params.get('partner_token');
    name = params.get('name');
    email = params.get('email');
    country_code = params.get('country_code');
    language_code = params.get('language_code');
    region_id = params.get('region_id');
    tenant_id = params.get('tenant_id');

    const currentHeaders = headers();
    const host = currentHeaders.get('host');

    switch (true) {
      case host.includes('exp'):
        typeOfBusiness = "exp Agent";
        type = "exp";
        break;
      case host.includes('viking'):
        typeOfBusiness = "viking Agent";
        type = "viking";
        break;
      case host.includes('kwcp'):
        typeOfBusiness = "kwcp Agent";
        type = "kwcp";
        break;
      case host.includes('cb'):
        type = "cb";
        typeOfBusiness = "cb Agent";
        break;
      case host.includes('c21'):
        type = "c21";
        typeOfBusiness = "c21 Agent";
        break;
      case host.includes('realsmart'):
        type = "realsmart";
        typeOfBusiness = "realsmart Agent";
        break;
      case host.includes('realty'):
        type = "realty";
        typeOfBusiness = "realty Agent";
        break;
      default:
        type = "ilist";
        typeOfBusiness = "iList Agent";
    }

    let userData = {
      "partner_token": partnerToken,
      "name": name,
      "email": email,
      "active": false,
      "typeOfBusiness": typeOfBusiness,
      "countryCode": country_code,
      "countryLanguage": language_code,
      "type": type,
      "region_id": region_id,
      "tenant_id": tenant_id
    }


    // sign up data 

    let tempUrl = host.includes('ilist') ? 'https://backend.proptexx.com/api/signup' : 'https://backend-rep.proptexx.com/api/signup'
    const response = await fetch(tempUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
      }
    )
    const signUpData = await response.json();
    if (signUpData.success) {
      console.log('sign up data', signUpData);
      const user_ref = signUpData.user_ref;
      const email = signUpData.email;

      return new Response(
        JSON.stringify({ user_ref, email }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Signup failed" }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (err) {
    console.log('error ', err)
    console.log('Received Payload1:', request);
  }
}