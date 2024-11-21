let externalData = null;

import { headers } from 'next/headers';

export async function POST(request) {
  let requestBody;
  let images = [];
  let isILIST = false;
  let domain = '';
  let dataAPI = '';
  let userRef = '';
  let propertyRef = '';
  let listing_id = '';

  try {
    requestBody = await request.text();
    const params = new URLSearchParams(requestBody);
    console.log('request params', params);
    const partnerToken = params.get('partner_token');
    const moduleRef = params.get('module');
    userRef = params.get('user_ref');
    let tenantId = ''

    switch (true) {
      case userRef.includes('ilist'):
        propertyRef = params.get('property_ref');
        isILIST = true;
        break;

      default:
        listing_id = params.get('listing_id');
        tenantId = params.get('tenantId');
        isILIST = false;
        break;
    }

    if (isILIST) {
      let index = 0;
      while (params.has(`images[${index}][imageRef]`)) {
        const imageRef = params.get(`images[${index}][imageRef]`);
        const imageURL = params.get(`images[${index}][imageURL]`);
        images.push({ imageRef, imageURL });
        index++;
      }
    } else {
      try {
        const apiUrl = 'https://api.realestateplatform.com/api/Account/ApiAuthenticate';
        const currentHeaders = headers();
        const host = currentHeaders.get('host');
        console.log('host url', host);
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
        const payload = {
          "apiProviderID": apiProviderID,
          "code": code
        };
        // working now
        const apiResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        const data = await apiResponse.json();
        const token = data.response?.result;

        if (token) {
          const fetchImageUrl = 'https://api.realestateplatform.com/api/services/app/ReadOnly/GetListingImages';  // Image fetch API
          const repPayload = {
            "listingId": listing_id,
            "watermarkEnum": "NWM",
            "imageSizeEnum": "Large"
          }

          const repImageResponse = await fetch(fetchImageUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(repPayload),
          });

          const result = await repImageResponse.json();
          if (result.success) {
            images = result.result;
            console.log('images for rep', images)
          } else {
            throw new Error('Images failed to fetch');
          }
        } else {
          console.error('Token not found in response');
          throw new Error('Token not found');
        }
      } catch (error) {
        console.error('Error calling external API:', error);
      }
    }

    console.log('Partner Token:', partnerToken);
    console.log('User Reference:', userRef);
    console.log('Module:', moduleRef);
    console.log('Property Reference:', propertyRef);
    console.log('Images:', images);
  } catch (err) {
    console.log('error ', err)
    console.log('Received Payload1:', request);
  }

  if (images.length > 0) {
    let formdata = {
      "listingId": isILIST ? propertyRef : listing_id,
      "images": images
    }

    switch (true) {
      case userRef.startsWith('ilist'):
        domain = 'ilist.proptexx.ai';
        dataAPI = 'https://backend.proptexx.com/api/getDetailsIlist';
        break;
      case userRef.startsWith('c21'):
        domain = 'c21-online-plus.proptexx.ai';
        dataAPI = 'https://backend.proptexx.com/api/getDetailsC21';
        break;
      case userRef.startsWith('cb'):
        domain = 'cb.proptexx.ai';
        dataAPI = 'https://backend.proptexx.com/api/getDetailsCb';
        break;
      case userRef.startsWith('exp'):
        domain = 'exp.proptexx.ai';
        dataAPI = 'https://backend.proptexx.com/api/getDetailsExp';
        break;
      case userRef.startsWith('kwcp'):
        domain = 'kwcp.proptexx.ai';
        dataAPI = 'https://backend.proptexx.com/api/getDetailsKwcp';
        break;
      case userRef.startsWith('realsmart'):
        domain = 'realsmart.proptexx.ai';
        dataAPI = 'https://backend.proptexx.com/api/getDetailsRealsmart';
        break;
      case userRef.startsWith('viking'):
        domain = 'viking.proptexx.ai';
        dataAPI = 'https://backend.proptexx.com/api/getDetailsViking';
        break;
      case userRef.startsWith('realty'):
        domain = 'realty.proptexx.ai';
        dataAPI = 'https://backend.proptexx.com/api/getDetailsRealty';
        break;
      default:
        domain = 'ilist.proptexx.ai';
        dataAPI = 'https://backend.proptexx.com/api/getDetailsIlist';
    }

    const externalResponse = await fetch(dataAPI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formdata),
    });

    if (!externalResponse.ok) {
      console.error('Failed to fetch external data');
      throw new Error('External API call failed');
    }
    externalData = await externalResponse.json();
    console.log('External API Data:', externalData);

    // store CRM User detail
    let userData = {
      "userRef": userRef,
    }
    let tempUrl = userRef.includes('ilist') ? 'https://backend.proptexx.com/api/getDetails' : 'https://backend-rep.proptexx.com/api/getDetails'
    await fetch(tempUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log('data result stored successfully')
        } else {
          console.log("Failed to upload");
        }
      })

    const redirectUrl = `https://${domain}/media-store`;
    console.log("new domain", domain);

    const html = `
      <html>
        <body>
          <script>
            window.location.href = "${redirectUrl}";
          </script>
        </body>
      </html>
    `;
    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } else {
    return new Response(JSON.stringify({ error: 'Invalid Payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}