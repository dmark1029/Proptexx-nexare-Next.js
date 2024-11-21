import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { headers } from "next/headers";
import "./globals.css";
import ReduxProvider from "../Redux/Provider";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
  const currentHeaders = headers();
  const host = currentHeaders.get("host");
  let title = "ILIST Media Toolkit";
  let icon = "/favicon/ilist.png";

  switch (true) {
    case host.includes("illist"):
      icon = "/favicon/ilist.png";
      title = "ILIST Media Toolkit";
      break;
    case host.includes("exp"):
      icon = "/favicon/exp.png";
      title = "EXP Media Toolkit";
      break;
    case host.includes("viking"):
      icon = "/favicon/viking.png";
      title = "VIKING Media Toolkit";
      break;
    case host.includes("cb"):
      icon = "/favicon/cb.png";
      title = "CB Media Toolkit";
      break;
    case host.includes("realsmart"):
      icon = "/favicon/realsmart.png";
      title = "Realsmart Media Toolkit";
      break;
    case host.includes("c21"):
      icon = "/favicon/c21.png";
      title = "C21 Media Toolkit";
      break;
    case host.includes("kwcp"):
      icon = "/favicon/kwcp.png";
      title = "KWCP Media Toolkit";
      break;
    case host.includes("realty"):
      icon = "/favicon/realty.png";
      title = "Realty One Media Toolkit";
      break;
    default:
      icon = "/favicon/ilist.png";
      title = "ILIST Media Toolkit";
  }

  return {
    title,
    icons: {
      icon,
    },
  };
}

export default async function RootLayout({ children }) {
  const metadata = await generateMetadata();

  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <link rel="icon" href={metadata.icons.icon} />
        {process.env.REACT_ENV === "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s) {
                  if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)
                }(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '117183353479633');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}
        <script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5VX7XGX3');
            `,
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5VX7XGX3"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        {process.env.REACT_ENV === "production" && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src="https://www.facebook.com/tr?id=117183353479633&ev=PageView&noscript=1"
            />
          </noscript>
        )}
        <link
          rel="shortcut icon"
          href="https://storage.googleapis.com/proptexx-store-widget/duda-assets/nexaicon.png"
        />
      </head>
      <body className={inter.className}>
        <ReduxProvider>
          <Header />
          {children}
          <ToastContainer />
          {/* <FooterProvider /> */}
        </ReduxProvider>
      </body>
    </html>
  );
}
