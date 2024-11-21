/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import "../../styles/widgetdocs.css";
import CodeSnippetBox from "@/components/CodeSnippetBox";

const StaticWidgetDocs = () => {
  const [clickedItem, setClickedItem] = useState("Installation");

  const handleClick = (itemName) => {
    setClickedItem(itemName);
  };
  const cssSnippet = `<link rel="stylesheet" href="https://storage.googleapis.com/proptexx-store-widget/main.css"/>`;
  const jsSnippet = `<script src="https://storage.googleapis.com/proptexx-store-widget/main_YOUR_ID.js"></script>`;
  const codeSnippet = `<link rel="stylesheet" href="https://storage.googleapis.com/proptexx-store-widget/main.css"/>                               <script src="https://storage.googleapis.com/proptexx-store-widget/main_YOUR_ID.js"></script>`;

  const linkItems = [
    // { name: "Introduction" },
    { name: "Installation" },
    { name: "Install in HTML, CSS and JS" },
    { name: "React" },
    { name: "Next JS" },
    { name: "PHP" },
    { name: "Laravel" },
    { name: "ASP.NET" },
    { name: "Flask" },
    { name: "WordPress" },
    { name: "Ruby on Rails" },
  ];

  //
  return (
    <>
      <div className="sticky md:!h-[calc(100vh-200px)]  w-full   container">
        <div className="flex flex-col md:!flex-row  ">
          {/* left side */}

          <div className="w-full md:!w-2/12 bg-white h-[calc(100vh-100px)] p-6 ml-24 md:ml-36 lg:ml-64 left-side-content">
            <p className="font-semibold text-lg text-gray-800">
              Getting Started
            </p>

            <div>
              {linkItems.map((item) => (
                // eslint-disable-next-line react/jsx-key
                <p
                  className={`hover:underline py-2 text-sm cursor-pointer ${
                    clickedItem === item.name
                      ? "text-clicked"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => handleClick(item.name)}
                >
                  {item.name}
                </p>
              ))}
            </div>
          </div>
          {/* Right Side */}
          <div className="w-full  md:!w-10/12 h-[calc(100vh-100px)] ml-2 md:ml-4 lg:ml-6 mt-4  right-side-content ">
            {/* Intro */}
            <div
              id="Introduction"
              className={`content-section ${
                clickedItem === "Introduction" ? "visible" : "hidden"
              }`}
            >
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight my-4">
                Introduction to the Widget
              </h1>

              <p className="my-4 font-bold">Step 1: Overview of the Widget</p>
              <p className="my-4">
                <span className=" font-bold">Functionality:</span>
                <span className="text-gray-500">
                  {" "}
                  The Widget is a dynamic tool designed to enhance web
                  applications. It allows for functionalities like user
                  authentication, image scraping, model execution, and analytics
                  tracking.
                </span>
              </p>
              <p className="my-4">
                <span className=" font-bold text-gray-500"> User Benefit:</span>{" "}
                <span className="text-gray-500">
                  It's intended to provide users with a richer, more interactive
                  web experience.
                </span>{" "}
              </p>

              <p className="my-4 font-bold">Step 2: Integration Process</p>
              <p className="my-4">
                <span className=" font-bold text-gray-500">
                  {" "}
                  Initial Setup:
                </span>{" "}
                <span className="text-gray-500">
                  Users start by receiving a link to integrate the Widget into
                  their web projects. This integration is designed to be
                  straightforward and user-friendly.
                </span>
              </p>
              <p className="my-4">
                <span className=" font-bold text-gray-500">
                  Security Measures:
                </span>
                <span className="text-gray-500">
                  {" "}
                  A validation script accompanies the integration process,
                  ensuring that the Widget is used securely and correctly.
                </span>{" "}
              </p>
              <p className="my-4 font-bold">
                Step 3: Customization and Configuration
              </p>
              <p className="my-4">
                <span className=" font-bold text-gray-500">Flexibility:</span>
                <span className="text-gray-500">
                  {" "}
                  Users have the option to customize the Widget according to
                  their specific needs. This could involve setting up user
                  authentication parameters, defining image scraping criteria,
                  etc.{" "}
                </span>{" "}
              </p>
              <p className="my-4 font-bold">
                Step 4: Regular Updates and Support
              </p>
              <p className="my-4">
                <span className=" font-bold text-gray-500">
                  Continuous Improvement:
                </span>
                <span className="text-gray-500">
                  {" "}
                  The Widget receives regular updates to enhance its features
                  and capabilities.{" "}
                </span>{" "}
              </p>
              <p className="my-4">
                <span className=" font-bold text-gray-500">
                  Support System:
                </span>{" "}
                <span className="text-gray-500">
                  A dedicated support system is in place to assist users with
                  any issues or questions they might have during integration or
                  usage.{" "}
                </span>{" "}
              </p>
              <p className="my-4 font-bold">
                Step 5: Seamless Integration and Usage
              </p>
              <p className="my-4">
                <span className=" font-bold text-gray-500">
                  User Experience:
                </span>
                <span className="text-gray-500">
                  {" "}
                  The Widget is designed to integrate seamlessly into various
                  web environments, ensuring a smooth user experience.
                </span>{" "}
              </p>

              <p className="my-4">
                <span className=" font-bold c"> Adaptability:</span>
                <span className="text-gray-500">
                  {" "}
                  It continuously evolves to meet the changing needs and
                  preferences of users, maintaining relevance and efficiency.{" "}
                </span>{" "}
              </p>
            </div>

            {/* 2 */}
            <div
              id="Installation"
              className={`content-section ${
                clickedItem === "Installation" ? "visible" : "hidden"
              }`}
            >
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight my-4">
                Installation Overview
              </h1>

              <p className="my-4 text-gray-500">
                The installation of our widget is designed to be straightforward
                and adaptable to various web development environments. This
                section provides a general overview of the installation process,
                applicable across different technologies like HTML CSS JS,
                React, Next.js, PHP, Laravel, ASP.NET, Flask, WordPress, and
                Ruby on Rails. Technology-specific instructions can be found in
                their respective sections moreover support team can help in the
                integration process.
              </p>
              <p className="my-4 font-bold">Steps to integrate widget</p>

              <p className="my-4">
                <span className=" font-bold ">
                  {" "}
                  Obtaining widget code strings -{" "}
                </span>
                <span className="text-gray-500">
                  {" "}
                  The first step involves obtaining the widget code files by
                  contacting the PropTexx team at{" "}
                  <a
                    href="https://proptexx.com/contact"
                    target="_blank"
                    className="text-[#4497ce] cursor-pointer"
                  >
                    contact form
                  </a>{" "}
                  or send us the
                  <a
                    className="text-[#4497ce] cursor-pointer"
                    href="mailto:stefan@proptexx.com"
                  >
                    {" "}
                    email
                  </a>{" "}
                  directly.
                </span>
              </p>

              <p className="my-4 ">
                <span className=" font-bold">
                  {" "}
                  Integrating widget to the website -{" "}
                </span>{" "}
                <span className="text-gray-500">
                  Depending on your technology stack, this step involves
                  including the widget's CSS and JavaScript files in your
                  project. This is usually done by linking the CSS file in the
                  &lt;head&gt; section of your HTML and the JavaScript file
                  before the closing &lt;/body&gt; tag.
                </span>
              </p>
              <p className="my-4">
                <span className=" font-bold">Verifying the integration - </span>{" "}
                <span className="text-gray-500">
                  Once the widget is added and configured, it's important to
                  verify that it's working as expected. This might involve
                  checking the widget's functionality on your web application or
                  running any provided test scripts.
                </span>
              </p>

              {/* <p className="font-bold">Note:</p>
              <p >
                Each web development environment may have specific nuances in the way the widget is integrated. Therefore, it's crucial to refer to the specific section of our documentation that aligns with the technology you're using.
              </p> */}
            </div>

            <div
              id="Install in HTML, CSS and JS"
              className={`content-section ${
                clickedItem === "Install in HTML, CSS and JS"
                  ? "visible"
                  : "hidden"
              }`}
            >
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight my-4">
                Integration in HTML, CSS and Javascript
              </h1>

              <p className="text-lg text-muted-foreground my-4">
                Install and configure in HTML, CSS and Javascript
              </p>
              <p className="my-4 font-bold ">
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 1:
                </span>{" "}
                Choose HTML File
              </p>

              <p className="my-4 text-gray-500">
                Select the HTML file where you want the widget to appear, such
                as index.html
              </p>
              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 2:
                </span>{" "}
                Insert CSS
              </p>
              <p className="my-4 text-gray-500">
                Place the CSS file link in the &lt;/body&gt; section of your
                HTML file.
              </p>
              <CodeSnippetBox snippet={cssSnippet} language="CSS" />
              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 3:
                </span>{" "}
                Add JavaScript
              </p>
              <p className="my-4 text-gray-500">
                Insert the JavaScript file script just before the closing
                &lt;/body&gt; tag in your HTML file.
              </p>

              <CodeSnippetBox snippet={jsSnippet} language="JS" />
            </div>
            {/* 2 */}

            <div
              id="React"
              className={`content-section ${
                clickedItem === "React" ? "visible" : "hidden"
              }`}
            >
              <div className="steps-container">
                <h1 className="scroll-m-20 text-4xl font-bold tracking-tight my-4">
                  React Integration:
                </h1>

                <p className="text-lg text-muted-foreground my-4">
                  Install and configure React Integration.
                </p>

                <p className="my-4 font-bold ">
                  <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                    Step 1:
                  </span>{" "}
                  Navigate to Layout File
                </p>
                <p className="my-4 text-gray-500">
                  Open the layout.jsx file in your React project.
                </p>
                <p className="my-4 font-bold">
                  <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block">
                    Step 2:
                  </span>{" "}
                  Insert CSS
                </p>
                <p className="my-4 text-gray-500 ">
                  Place the CSS file link in the &lt;/body&gt; section of your
                  HTML file.
                </p>
                <CodeSnippetBox snippet={cssSnippet} language="CSS" />
                <p className="my-4 font-bold">
                  <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block">
                    Step 3:
                  </span>{" "}
                  Add JavaScript
                </p>
                <p className="my-4 text-gray-500">
                  Place the JavaScript file script before the closing
                  &lt;/body&gt; tag in the layout.jsx file
                </p>
                <CodeSnippetBox snippet={jsSnippet} language="JS" />
              </div>
            </div>

            <div
              id="Next JS"
              className={`content-section ${
                clickedItem === "Next JS" ? "visible" : "hidden"
              }`}
            >
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight my-4">
                Next.js Integration:
              </h1>

              <p className="text-lg text-muted-foreground my-4">
                Install and configure Next.js Integration.
              </p>

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 1:
                </span>{" "}
                Navigate to Layout File
              </p>
              <p className="my-4 text-gray-500">
                Open the layout.jsx file in your Next.js project.
              </p>

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 2:
                </span>{" "}
                Insert CSS
              </p>
              <p className="my-4 text-gray-500">
                Place the CSS file link in the &lt;/body&gt; section of your
                HTML file.
              </p>
              <CodeSnippetBox snippet={cssSnippet} language="CSS" />

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 3:
                </span>{" "}
                Add JavaScript
              </p>
              <p className="my-4 text-gray-500">
                Place the JavaScript file script before the closing
                &lt;/body&gt; tag in the layout.jsx file
              </p>
              <CodeSnippetBox snippet={jsSnippet} language="JS" />
            </div>

            {/* 3 */}
            <div
              id="PHP"
              className={`content-section ${
                clickedItem === "PHP" ? "visible" : "hidden"
              }`}
            >
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight my-4">
                PHP Integration:
              </h1>
              <p className="text-lg text-muted-foreground my-4">
                To embed a widget in a PHP web application:
              </p>

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 1:
                </span>{" "}
                Choose PHP File
              </p>
              <p className="my-4 text-gray-500">
                Select the PHP view file, such as index.php, where you want the
                widget to appear.
              </p>

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 2:
                </span>{" "}
                Insert CSS
              </p>
              <p className="my-4 text-gray-500">
                Add the CSS file link to the head section of your PHP file.
              </p>
              <CodeSnippetBox snippet={cssSnippet} language="CSS" />

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 3:
                </span>{" "}
                Add JavaScript
              </p>
              <p className="my-4 text-gray-500">
                Insert the JavaScript file script just before the closing
                &lt;/body&gt; tag of your PHP file.
              </p>
              <CodeSnippetBox snippet={jsSnippet} language="JS" />
            </div>

            {/* 4 */}
            <div
              id="Laravel"
              className={`content-section ${
                clickedItem === "Laravel" ? "visible" : "hidden"
              }`}
            >
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight my-4">
                Laravel Integration:
              </h1>
              <p className="text-lg text-muted-foreground my-4">
                To embed a widget in a Laravel web application:
              </p>

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 1:
                </span>{" "}
                Select Blade View File
              </p>
              <p className="my-4 text-gray-500">
                Choose the Blade view file, like welcome.blade.php, where the
                widget will be displayed.
              </p>

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 2:
                </span>{" "}
                Insert CSS
              </p>
              <p className="my-4 text-gray-500">
                Add the CSS file link to the head section of your Blade file.
              </p>
              <CodeSnippetBox snippet={cssSnippet} language="CSS" />

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 3:
                </span>{" "}
                Add JavaScript
              </p>
              <p className="my-4 text-gray-500">
                Place the JavaScript file script just before the closing
                &lt;/body&gt; tag of your Blade file.
              </p>
              <CodeSnippetBox snippet={jsSnippet} language="JS" />
            </div>

            {/* 5 */}
            <div
              id="ASP.NET"
              className={`content-section ${
                clickedItem === "ASP.NET" ? "visible" : "hidden"
              }`}
            >
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight my-4">
                ASP.NET Integration:
              </h1>
              <p className="text-lg text-muted-foreground my-4 ">
                To embed a widget in an ASP.NET web application:
              </p>

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 1:
                </span>{" "}
                Choose ASP.NET File
              </p>
              <p className="my-4 text-gray-500">
                Select the ASP.NET web form file, such as Default.aspx, where
                the widget will be displayed.
              </p>

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 2:
                </span>{" "}
                Insert CSS
              </p>
              <p className="my-4 text-gray-500">
                Add the CSS file link to the head section of your ASP.NET file.
              </p>
              <CodeSnippetBox snippet={cssSnippet} language="CSS" />

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 3:
                </span>{" "}
                Add JavaScript
              </p>
              <p className="my-4 text-gray-500">
                Insert the JavaScript file script just before the closing
                &lt;/body&gt; tag of your ASP.NET file.
              </p>
              <CodeSnippetBox snippet={jsSnippet} language="JS" />
            </div>

            {/* 6 */}
            <div
              id="Flask"
              className={`content-section ${
                clickedItem === "Flask" ? "visible" : "hidden"
              }`}
            >
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight my-4">
                Flask Integration:
              </h1>
              <p className="text-lg text-muted-foreground my-4">
                To embed a widget in a Flask web application:
              </p>

              <p className="my-4 font-bold">
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 1:
                </span>{" "}
                Choose HTML Template File
              </p>
              <p className="my-4 text-gray-500">
                Select the HTML template file, such as home.html, for displaying
                the widget.
              </p>

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 2:
                </span>{" "}
                Insert CSS
              </p>
              <p className="my-4 text-gray-500">
                Add the CSS file link to the head section of your HTML template
                file.
              </p>
              <CodeSnippetBox snippet={cssSnippet} language="CSS" />

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 3:
                </span>{" "}
                Add JavaScript
              </p>
              <p className="my-4 text-gray-500">
                Place the JavaScript file script just before the closing
                &lt;/body&gt; tag of your HTML template file.
              </p>
              <CodeSnippetBox snippet={jsSnippet} language="JS" />
            </div>

            {/* 7 */}
            <div
              id="WordPress"
              className={`content-section ${
                clickedItem === "WordPress" ? "visible" : "hidden"
              }`}
            >
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight my-4">
                WordPress Integration:
              </h1>
              <p className="text-lg text-muted-foreground my-4">
                Navigate to the theme editor in your WordPress dashboard.
              </p>

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 1:
                </span>{" "}
                Access Theme Editor
              </p>
              <p className="my-4 text-gray-500">
                Navigate to the theme editor within your WordPress dashboard.
              </p>

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 2:
                </span>{" "}
                Choose PHP Template File
              </p>
              <p className="my-4 text-gray-500">
                Select the appropriate PHP template file, like footer.php or
                sidebar.php, where the widget will be displayed.
              </p>

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 3:
                </span>{" "}
                Insert CSS
              </p>
              <p className="my- text-gray-500">
                Add the CSS file link to the head section of your chosen PHP
                template file.
              </p>
              <CodeSnippetBox snippet={cssSnippet} language="CSS" />

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 4:
                </span>{" "}
                Add JavaScript
              </p>
              <p className="my-4 text-gray-500">
                Place the JavaScript file script just before the closing
                &lt;/body&gt; tag in your PHP template file.
              </p>
              <CodeSnippetBox snippet={jsSnippet} language="JS" />
            </div>

            {/* 11 */}
            <div
              id="Ruby on Rails"
              className={`content-section ${
                clickedItem === "Ruby on Rails" ? "visible" : "hidden"
              }`}
            >
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight my-4">
                Ruby on Rails Integration:
              </h1>
              <p className="text-lg text-muted-foreground my-4">
                To embed a widget in a Ruby on Rails application:
              </p>

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 1:
                </span>{" "}
                Open Layout File
              </p>
              <p className="my-4 text-gray-500">
                Navigate to the main layout file, typically
                application.html.erb, located in app/views/layouts.
              </p>

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 2:
                </span>{" "}
                Insert CSS
              </p>
              <p className="my-4 text-gray-500">
                Include the CSS file link in the head section of the layout
                file.
              </p>
              <CodeSnippetBox snippet={cssSnippet} language="CSS" />

              <p className="my-4 font-bold">
                {" "}
                <span className="text-center w-16 h-6 bg-gray-200 rounded-full inline-block ">
                  Step 3:
                </span>{" "}
                Add JavaScript
              </p>
              <p className="my-4 text-gray-500">
                Add the JavaScript file script just before the closing
                &lt;/body&gt; tag in the layout file.
              </p>
              <CodeSnippetBox snippet={jsSnippet} language="JS" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaticWidgetDocs;
