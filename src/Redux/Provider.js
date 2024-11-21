"use client";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { store } from "./store";
import { useEffect } from "react";
import TagManager from "react-gtm-module";
import NextAuthProvider from "@/components/NextAuthProvider";
import Intercom from "@intercom/messenger-js-sdk";

persistStore(store);

export default function ReduxProvider({ children }) {
  useEffect(() => {
    Intercom({
      app_id: "precv613",
    });
    // const widget = document.createElement("script");

    // widget.src = process.env.NEXT_PUBLIC_WIDGET_URL;

    // document.head.appendChild(widget);

    const tagManagerArgs = {
      gtmId: "AW-11196102053",
    };
    const tagManagerArgs2 = {
      gtmId: "G-HEG1XE9G47",
    };

    const tagManagerArgs3 = {
      gtmId: "GTM-5VX7XGX3",
    };
    TagManager.initialize(tagManagerArgs);
    TagManager.initialize(tagManagerArgs2);
    TagManager.initialize(tagManagerArgs3);
    const script = document.createElement("script");
    const script2 = document.createElement("script");
    const script3 = document.createElement("script");
    // const scriptGTM = document.createElement("script");
    // const noscript = document.createElement("noscript");
    // scriptGTM.src = "https://www.googletagmanager.com/gtm.js?id=GTM-5VX7XGX3";
    script2.src = "https://www.googletagmanager.com/gtag/js?id=AW-11196102053";
    script3.src = "https://www.googletagmanager.com/gtag/js?id=G-HEG1XE9G47";

    // noscript.innerHTML = `
    //   <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5VX7XGX3"
    //     height="0" width="0" style="display:none;visibility:hidden"></iframe>
    // `;

    if (process.env.REACT_ENV === "production") {
      script.innerHTML = `
      (function(h,o,t,j,a,r){ 
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:3369713,hjsv:6}; 
        a=o.getElementsByTagName('head')[0]; 
        r=o.createElement('script');r.async=1; 
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv; 
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-11196102053');
      gtag('config', 'G-HEG1XE9G47');

      function gtag_report_conversion(url) {
        var callback = function () {
          if (typeof(url) !== 'undefined') {
            console.log(url);
          }
        };
        gtag('event', 'conversion', {
          'send_to': 'AW-11196102053/RMa3COWdyaQYEKXr29op',
          'event_callback': callback
        });
        return false;
      }
    `;
      // document.head.appendChild(scriptGTM);
      // document.head.appendChild(noscript);
      document.head.appendChild(script);
      document.head.appendChild(script2);
      document.head.appendChild(script3);
      // HubSpot script

      const hubspotScript = document.createElement("script");
      hubspotScript.setAttribute("type", "text/javascript");
      hubspotScript.setAttribute("id", "hs-script-loader");
      hubspotScript.setAttribute("async", true);
      hubspotScript.setAttribute("defer", true);
      hubspotScript.src = "//js-na1.hs-scripts.com/23108288.js";
      document.head.appendChild(hubspotScript);
    }
  }, []);
  return (
    <Provider store={store}>
      <NextAuthProvider>{children}</NextAuthProvider>
    </Provider>
  );
}
