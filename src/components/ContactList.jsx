"use client";
import React from "react";
import Translate from "./Translate";
const ContactList = ({ getContacts }) => {
  return (
    <div>
      <div className="mt-20 mx-[5%]">
        <div className="container mx-auto p-6 bg-white text-black">
          <div className="relative overflow-x-auto shadow-md sm:!rounded-lg mt-5">
            <h1 className="text-xl font-semibold mb-2 p-3">
              <Translate text="User Contact Info" />
            </h1>
            <table className="w-full text-sm text-left text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">
                    <Translate text="Company Name" />
                  </th>
                  <th className="px-6 py-3">
                    <Translate text="Business Email" />
                  </th>
                  <th className="px-6 py-3">
                    <Translate text="First Name" />
                  </th>
                  <th className="px-6 py-3">
                    <Translate text="Last Name" />
                  </th>
                  <th className="px-6 py-3">
                    <Translate text="Phone Number" />
                  </th>
                  <th className="px-6 py-3">
                    <Translate text="Website URL" />
                  </th>
                  <th className="px-6 py-3">
                    <Translate text="Number of monthly active listings" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {getContacts?.map((contact, index) => (
                  <tr
                    key={index}
                    className="bg-white border-b  hover:!bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <td className="px-6 py-2">{contact.company}</td>
                    <td className="px-6 py-2">{contact.email}</td>
                    <td className="px-6 py-2">{contact.firstName}</td>
                    <td className="px-6 py-2">{contact.lastName}</td>
                    <td className="px-6 py-2">{contact.phone}</td>
                    <td className="px-6 py-2">{contact.webUrl}</td>
                    <td className="px-6 py-2">{contact.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
