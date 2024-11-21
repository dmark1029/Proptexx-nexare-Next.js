"use client";
import React, { useRef } from "react";
import Translate from "@/components/Translate";
import { Modal, debounce } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import FormInput from "./FormInput";
import WidgetDownloadPdf from "./template/WidgetDownloadPdf";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { versionPoints } from "@/utils/sampleData";
import { getPagesToShow } from "@/utils/getPagesToShow";

const GiveWidgetAccess = ({}) => {
  const { token, user } = useSelector((state) => state.auth.user);
  const [pdfDownloadLoading, setPdfDownloadLoading] = useState(false);
  const [pdfDownloadIndex, setPdfDownloadIndex] = useState(false);
  const [open, setOpen] = useState(false);
  const [authenticateModal, setAuthenticateModal] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [widgetList, setWidgetList] = useState([]);
  const [versionList, setVersionList] = useState([]);
  const [downloadFilename, setDownloadFilename] = useState(
    "https://storage.googleapis.com/proptexx-store-widget/main_YOUR_ID.js"
  );
  const [totalPages, setTotalPages] = useState(0);
  const [widgetDetail, setWidgetDetail] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    domain: [],
    version: "",
    ctaId: "",
    scrapingArrayId: "",
    urls: [],
    jsfile: "",
    prohibitedUrls: [],
    region: process.env.NEXT_PUBLIC_REGION,
  });

  const [domainValue, setDomainValue] = useState("");
  const [urlsValue, setUrlsValue] = useState("");
  const [prohibitedUrlsValue, setProhibitedUrlsValue] = useState("");
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [prevSearchValue, setPrevSearchValue] = useState("");
  let searchRef = useRef();

  const waitForRender = async (element, timeout = 30000) => {
    let elapsed = 0;
    const delay = 500;

    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (element.scrollHeight > 0) {
          clearInterval(interval);
          resolve();
        } else if (elapsed > timeout) {
          clearInterval(interval);
          reject(new Error("Render timeout exceeded"));
        }
        elapsed += delay;
      }, delay);
    });
  };

  const handleDownloadPDF = async (event, filename) => {
    event.preventDefault();
    setPdfDownloadLoading(true);
    const content = document.getElementById("content-to-pdf");
    if (content) {
      let htmlContent = content.innerHTML;
      htmlContent = htmlContent.replaceAll(downloadFilename, filename);
      setDownloadFilename(filename);
      content.innerHTML = htmlContent;
    }
    const codeSnippets = content.querySelectorAll("pre");
    codeSnippets.forEach((snippet) => {
      snippet.classList.add("code-snippet-style");
    });
    content.classList.add("pdf-text-large");
    try {
      content.innerHTML +=
        '<div style="height: 10px; overflow: hidden;"></div>';

      await new Promise((resolve) => setTimeout(resolve, 0));

      await waitForRender(content);

      const canvas = await html2canvas(content, {
        scale: 2,
        logging: true,
        useCORS: true,
        onclone: (documentClone) => {
          const cloneContent = documentClone.getElementById("content-to-pdf");
          if (cloneContent) {
            cloneContent.style.visibility = "visible";
            cloneContent.style.position = "relative";
            cloneContent.style.height = "";
            cloneContent.style.overflow = "visible";
          }
        },
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageHeight = pdf.internal.pageSize.getHeight() - 20;
      const imgWidth = 190;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(canvas, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(canvas, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("widget-docs.pdf");
      setPdfDownloadLoading(false);
    } catch (error) {
      console.error("Error generating PDF: ", error);
      setPdfDownloadLoading(false);
    } finally {
    }
  };

  const handleUrls = (urls, urlValue) => {
    if (!urlValue) return;
    setWidgetDetail((prev) => {
      let updatedUrls = prev[urls] ? [...prev[urls], urlValue] : [urlValue];
      return { ...prev, [urls]: updatedUrls };
    });
    setUrlsValue("");
    setProhibitedUrlsValue("");
    setDomainValue("");
  };

  const removeUrls = (index, urls) => {
    setWidgetDetail((prev) => ({
      ...prev,
      [urls]: prev[urls].filter((_, idx) => idx !== index),
    }));
  };

  const updateUrls = (e, index, urls) => {
    const updatedUrls = [...widgetDetail[urls]];
    updatedUrls[index] = e.target.value;
    setWidgetDetail({
      ...widgetDetail,
      [urls]: updatedUrls,
    });
  };

  const getWidgetData = async () => {
    try {
      const currentSearchValue = searchRef.current
        ? searchRef.current
        : searchRef.current?.value ?? "";
      if (currentSearchValue !== prevSearchValue) {
        setWidgetList(null);
        setCurrentPage(1);
        setPrevSearchValue(currentSearchValue);
      }

      const queryParams = new URLSearchParams({
        search: currentSearchValue,
        page: currentPage,
        limit: 10,
      }).toString();

      const widgetData = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/api/widget/getallwidgets?${queryParams}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWidgetList(widgetData?.data?.widgets.results);
      setTotalPages(widgetData?.data?.widgets.totalPages);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getWidgetData();
  }, [currentPage, searchRef?.current]);

  const handleChange = (e) => {
    setWidgetDetail({ ...widgetDetail, [e.target.name]: e.target.value });
  };
  // addWidgetDomain ...
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!widgetDetail?.version) {
      toast.error("Please select widget version");
      return;
    }
    if (widgetDetail?.domain.length === 0) {
      toast.error("Please add atleast one domain");
      return;
    }

    if (!updateId) {
      const filesGenerate = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI}/api/models/uploadjsfile/${widgetDetail?.version}`
      );
      if (filesGenerate?.data) {
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_API_URI}/api/widget/createwidgetdomain`,
            {
              ...widgetDetail,
              jsfile: filesGenerate?.data?.jsFileUrl,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            if (response?.data?.message) {
              toast.error(response?.data?.message);
              return;
            } else if (response?.data?.widget) {
              toast.success("Widget created successfully");
              getWidgetData();
              setOpen(false);
            }
          })
          .catch((error) => {
            console.log(error);
            toast.error(error?.response?.data?.message);
          });
      }
    } else {
      await axios
        .put(
          `${process.env.NEXT_PUBLIC_API_URI}/api/widget/updatewidget/${updateId}`,
          widgetDetail,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response?.data?.message == "failed to update") {
            toast.error("Failed to update");
            return;
          } else if (response?.data?.widget) {
            setWidgetList((prev) =>
              prev.map((widget) =>
                widget?._id === response?.data?.widget._id
                  ? response?.data?.widget
                  : widget
              )
            );
            setOpen(false);
          }
        })
        .catch((error) => {
          toast.error(`Failed to update`);
        });
    }
  };

  const authenticate = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (
      email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
      password !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD
    ) {
      toast.error("Invalid Credentials");
      return;
    } else {
      toast.success("Authenticated");
      setAuthenticateModal(false);
      setIsAuthenticated(true);
    }
  };

  const handleDelete = async () => {
    const result = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URI}/api/widget/deletewidget/${deleteItem?._id}`,
      {
        jsfile: deleteItem?.jsfile.split("/").pop(),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (result?.data?.message == "Deleted successfully") {
      setWidgetList(widgetList.filter((val) => val?._id !== deleteItem?._id));
      setDeleteModal(false);
      toast.success("Deleted Successfully");
    } else {
      toast.error("Not deleted");
    }
  };

  // get widget versions
  const getWidgetVersions = async () => {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URI}/api/widget/getwidgetversions`
    );
    if (data?.versionList?.length) {
      const res = data?.versionList?.map((item) =>
        item?.replace("_", " ")?.replace(".js", "")
      );
      setVersionList(res);
    }
  };
  return (
    <div className="mt-20 mx-[5%]">
      {isAuthenticated && (
        <section className="">
          <div className="mx-auto max-w-screen-xl ">
            <input
              type="text"
              placeholder="Search"
              className="border-[1px] !border-mainColor h-10 rounded pl-2 my-5 w-full"
              onChange={debounce((event) => {
                const { value } = event.target;
                searchRef.current = value;
                getWidgetData();
                event.stopPropagation();
              }, 600)}
            />
            <div className="bg-white  relative shadow-md sm:!rounded-lg overflow-hidden">
              <div className="flex flex-col md:!flex-row items-center justify-between space-y-3 md:!space-y-0 md:!space-x-4 p-4">
                <div className="w-full md:!w-auto flex flex-col md:!flex-row space-y-2 md:!space-y-0 items-stretch md:!items-center justify-end md:!space-x-3 flex-shrink-0">
                  <button
                    onClick={() => {
                      setOpen(true);
                      setUpdateId(null);
                      getWidgetVersions();
                      setWidgetDetail({
                        name: "",
                        email: "",
                        domain: [],
                        jsfile: "",
                        version: "",
                        ctaId: "",
                        scrapingArrayId: "",
                        urls: [],
                        region: process.env.NEXT_PUBLIC_REGION,
                      });
                    }}
                    type="button"
                    className="flex items-center justify-center !bg-black font-medium rounded-lg text-sm px-4 py-2 text-white"
                  >
                    <Translate text="Add product" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto mb-5">
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr>
                      <th scope="col" className="px-4 py-3">
                        <Translate text="Domain" />
                      </th>
                      <th scope="col" className="px-4 py-3">
                        <Translate text="Permitted Urls" />
                      </th>
                      <th scope="col" className="px-4 py-3">
                        <Translate text="Prohibited Urls" />
                      </th>
                      <th scope="col" className="px-4 py-3">
                        <Translate text="Email" />
                      </th>
                      <th scope="col" className="px-4 py-3">
                        <Translate text="JS file" />
                      </th>
                      <th scope="col" className="px-4 py-3">
                        <Translate text="Actions" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {widgetList?.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-3">
                          <ul>
                            {item?.domain?.map((dom, index) => (
                              <li key={index}>{dom}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-4 py-3">
                          <ul>
                            {item?.urls?.map((url, index) => (
                              <li key={index}>{url}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-4 py-3">
                          <ul>
                            {item?.prohibitedUrls?.map((url, index) => (
                              <li key={index}>{url}</li>
                            ))}
                          </ul>
                        </td>
                        <td className="px-4 py-3">{item?.email}</td>
                        <td className="px-4 py-3">{item?.jsfile}</td>
                        <td className="px-4 py-3 flex gap-2">
                          <button
                            disabled={pdfDownloadLoading}
                            className={`bg-black text-white disabled:${
                              pdfDownloadLoading &&
                              pdfDownloadIndex !== index &&
                              "bg-[#707070]"
                            } text-lg p-2 rounded-lg w-[120px] flex justify-center items-center`}
                            onClick={(e) => {
                              handleDownloadPDF(e, item?.jsfile);
                              setPdfDownloadIndex(index);
                            }}
                          >
                            {pdfDownloadLoading &&
                            pdfDownloadIndex === index ? (
                              <div className="spinner" id="spinner"></div>
                            ) : (
                              <Translate text="Download " />
                            )}
                          </button>
                          <button
                            className="bg-green-400 text-white text-lg p-2 rounded-lg"
                            onClick={() => {
                              setUpdateId(item?._id);
                              setWidgetDetail({
                                name: item?.name,
                                email: item?.email,
                                domain: item?.domain,
                                urls: item?.urls,
                                prohibitedUrls: item?.prohibitedUrls,
                                version: item?.version,
                                jsfile: item?.jsfile,
                                ctaId: item?.ctaId,
                                scrapingArrayId: item?.scrapingArrayId,
                              });
                              getWidgetVersions();
                              setOpen(true);
                            }}
                          >
                            <Translate text="update" />
                          </button>
                          <button
                            className="bg-red-400 text-white text-lg p-2 rounded-lg"
                            onClick={() => {
                              setDeleteModal(true);
                              setDeleteItem(item);
                            }}
                          >
                            <Translate text="Delete" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center mt-4  mb-5">
              <button
                className="mr-2 px-4 py-2 bg-gray-300 hover:!bg-gray-400 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <Translate text="Previous" />
              </button>
              {getPagesToShow(currentPage, totalPages).map((page) => (
                <button
                  key={page}
                  className={`px-2 py-2 ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 hover:!bg-gray-400"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                className="ml-2 px-4 py-2 bg-gray-300 hover:!bg-gray-400 disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <Translate text="Next" />
              </button>
            </div>
          </div>
        </section>
      )}
      <WidgetDownloadPdf />
      {/* add and edit widget user access modal  */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <div className="absolute outline-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-100 rounded-[8px] overflow-hidden max-w-[800px] w-[90%] shadow-lg max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center bg-[#F1F5F9] p-[35px_40px]">
            <h2 className="text-center text-[22px] font-[600]">
              {updateId ? "Update Widget" : "Add Widget"}
            </h2>

            <select
              id="dropdown"
              value={widgetDetail?.version || ""}
              onChange={(e) =>
                setWidgetDetail({ ...widgetDetail, version: e.target.value })
              }
              className="bg-transparent p-[10px] border border-[#929292] rounded-[5px] text-[#3b3b3b] text-[14px] font-[500]"
            >
              <option value="">Select Version</option>
              {versionList.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="bg-[#ffffff] p-[30px_23px]">
            <div className="flex flex-col max-h-[200px] overflow-y-auto">
              <h4 className="font-[500] text-[16px] text-[#000000]">
                VERSION {widgetDetail?.version?.replace("v", "")}
              </h4>
              <ol className="w-[90%] text-[#696969] !my-[30px] ml-5">
                {versionPoints
                  ?.find((item) => item.version == widgetDetail?.version)
                  ?.list?.map((item, index) => (
                    <li key={index}>
                      {index + 1}. {item}
                    </li>
                  ))}
              </ol>
            </div>
          </div>
          <form className="p-6 mb-4">
            {!updateId && (
              <>
                <div className="grid grid-cols-2 gap-[20px]">
                  <div className="mb-3">
                    <label className="block text-gray-700 text-sm mb-3">
                      <Translate text="First Name" />
                    </label>
                    <FormInput
                      className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="firstName"
                      placeholder="Enter First Name"
                      type="text"
                      onChange={handleChange}
                      value={widgetDetail?.firstName}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-700 text-sm mb-3">
                      <Translate text="Last Name" />
                    </label>
                    <FormInput
                      className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Enter Last Name"
                      name="lastName"
                      type="text"
                      onChange={handleChange}
                      value={widgetDetail?.lastName}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-[20px]">
                  <div className="mb-3">
                    <label className="block text-gray-700 text-sm mb-3">
                      <Translate text="Email" />
                    </label>
                    <FormInput
                      className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Enter Email"
                      name="email"
                      type="email"
                      value={widgetDetail?.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-gray-700 text-sm mb-3">
                      <Translate text="Phone" />
                    </label>
                    <FormInput
                      className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="Enter Phone Number"
                      name="phone"
                      type="text"
                      onChange={handleChange}
                      value={widgetDetail?.phone}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="grid grid-cols-1 mb-3">
              <label className="block text-gray-700 text-sm">
                <Translate text="CTA ID" />
              </label>
              <FormInput
                className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter CTA ID"
                name="ctaId"
                type="ctaId"
                value={widgetDetail?.ctaId}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-1 mb-3">
              <label className="block text-gray-700 text-sm">
                <Translate text="Scraping Array Id" />
              </label>
              <FormInput
                className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter Scraping Array Id"
                name="scrapingArrayId"
                type="scrapingArrayId"
                value={widgetDetail?.scrapingArrayId}
                onChange={handleChange}
              />
            </div>
            <div className="email-input-container">
              <label className="block text-gray-700 text-sm mb-3">
                <Translate text="Domains" />
              </label>
              {widgetDetail?.domain?.map((dom, index) => (
                <div key={index} className="relative">
                  <FormInput
                    className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
                    value={dom}
                    onChange={(e) => updateUrls(e, index, "domain")}
                  />
                  <span
                    className="absolute right-2 top-[15%] cursor-pointer"
                    onClick={() => removeUrls(index, "domain")}
                  >
                    <MdCancel size={20} className="text-gray-500" />
                  </span>
                </div>
              ))}
              <div className="flex gap-5">
                <FormInput
                  className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={domainValue}
                  onChange={(e) => setDomainValue(e.target.value)}
                  placeholder="Type an domain and press Enter..."
                />
                <div
                  className="text-sm text-gray-500 flex justify-center items-center gap-1 cursor-pointer"
                  onClick={() => handleUrls("domain", domainValue)}
                >
                  <FaPlus />
                  <span>Add</span>
                </div>
              </div>
            </div>
            {/* included urls */}
            <div className="email-input-container">
              <label className="block text-gray-700 text-sm my-3">
                <Translate text="Permitted URLs" />
              </label>
              {widgetDetail?.urls?.map((url, index) => (
                <div key={index} className="relative">
                  <FormInput
                    className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
                    value={url}
                    onChange={(e) => updateUrls(e, index, "urls")}
                  />
                  <span
                    className="absolute right-2 top-[15%] cursor-pointer"
                    onClick={() => removeUrls(index, "urls")}
                  >
                    <MdCancel size={20} className="text-gray-500" />
                  </span>
                </div>
              ))}
              <div className="flex gap-5">
                <FormInput
                  className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={urlsValue}
                  disabled={
                    widgetDetail?.prohibitedUrls?.length &&
                    !widgetDetail?.urls?.length
                      ? true
                      : false
                  }
                  onChange={(e) => setUrlsValue(e.target.value)}
                  placeholder="Type an domain and press Enter..."
                />
                <div
                  className="text-sm text-gray-500 flex justify-center items-center gap-1 cursor-pointer"
                  onClick={() => handleUrls("urls", urlsValue)}
                >
                  <FaPlus />
                  <span>Add</span>
                </div>
              </div>
            </div>

            {/* excluded urls */}
            <div className="email-input-container">
              <label className="block text-gray-700 text-sm my-3">
                <Translate text="Prohibited URLs" />
              </label>
              {widgetDetail?.prohibitedUrls?.map((url, index) => (
                <div key={index} className="relative">
                  <FormInput
                    className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
                    value={url}
                    onChange={(e) => updateUrls(e, index, "prohibitedUrls")}
                  />
                  <span
                    className="absolute right-2 top-[15%] cursor-pointer"
                    onClick={() => removeUrls(index, "prohibitedUrls")}
                  >
                    <MdCancel size={20} className="text-gray-500" />
                  </span>
                </div>
              ))}
              <div className="flex gap-5">
                <FormInput
                  className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={prohibitedUrlsValue}
                  disabled={
                    widgetDetail?.urls?.length &&
                    !widgetDetail?.prohibitedUrls?.length
                      ? true
                      : false
                  }
                  onChange={(e) => setProhibitedUrlsValue(e.target.value)}
                  placeholder="Type an domain and press Enter..."
                />
                <div
                  className="text-sm text-gray-500 flex justify-center items-center gap-1 cursor-pointer"
                  onClick={() =>
                    handleUrls("prohibitedUrls", prohibitedUrlsValue)
                  }
                >
                  <FaPlus />
                  <span>Add</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                className="mt-3 !bg-mainColor text-sm hover:!bg-gray-500 border-black  text-white w-full py-3 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={handleSubmit}
              >
                {updateId ? "Update" : "Add"}
              </button>
              <button
                className="mt-3 !bg-white text-sm border-[1px] border-black text-black font-semibold w-full py-3 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        open={authenticateModal}
        onClose={() => setAuthenticateModal(false)}
      >
        <div className="absolute outline-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-100 rounded-[8px] overflow-hidden max-w-[800px] w-[90%] shadow-lg max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center bg-[#F1F5F9] p-[35px_40px]">
            <h2 className="text-center text-[22px] font-[600]">Authenticate</h2>
          </div>
          <form className="pb-[35px] mx-[60px]" onSubmit={authenticate}>
            <>
              <div className="grid grid-cols-1 gap-[20px]">
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm mb-3">
                    <Translate text="Email" />
                  </label>
                  <FormInput
                    className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter Email"
                    id="email"
                    name="email"
                    type="email"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-gray-700 text-sm mb-3">
                    <Translate text="Password" />
                  </label>
                  <FormInput
                    className="border rounded w-full py-1.5 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter Password"
                    id="password"
                    name="password"
                    type="password"
                  />
                </div>
              </div>
            </>

            <div className="flex items-center justify-between gap-2">
              <button
                className="mt-3 !bg-mainColor text-sm hover:!bg-gray-500 border-black  text-white w-full py-3 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Authenticate
              </button>
              <button
                className="mt-3 !bg-white text-sm border-[1px] border-black text-black font-semibold w-full py-3 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => setAuthenticateModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal open={deleteModal} onClose={() => setDeleteModal(false)}>
        <div className="absolute outline-none top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-100 rounded-[8px] overflow-hidden max-w-[400px] w-[90%] shadow-lg max-h-[90vh] overflow-y-auto p-8">
          <div className="flex justify-between items-center bg-[#F1F5F9] ">
            <h2 className="text-center text-[22px] font-[600]">
              Are You Sure You Want To Delete ?
            </h2>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              className="mt-3 !bg-mainColor text-sm hover:!bg-gray-500   text-white w-full py-3 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => handleDelete()}
            >
              Yes
            </button>
            <button
              className="mt-3 !bg-white text-sm border-[1px] border-black text-black font-semibold w-full py-3 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => setDeleteModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GiveWidgetAccess;
