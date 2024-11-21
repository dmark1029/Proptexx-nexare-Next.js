"use client";
import AuhtProvider from "@/components/AuthProvider";
import { services, textServices, comingSoon } from "../utils/sampleData";
import Link from "next/link";
import Translate from "@/components/Translate";

const Home = () => {
  const filteredServices = services.filter(
    (service) =>
      service.name !== 'Grass Repair' &&
      service.name !== 'Object Removal' &&
      service.name !== 'Virtual Renovation'
  );

  return (
    <AuhtProvider>
      <div className="px-[5%] lg:!px-[10%] 2xl:!px-[20%] py-5 mb-8">
        <h1 className="text-[32px] font-[600] mb-1 !text-black !font-allround">
          <Translate text="AI Media Store" />
        </h1>
        <p className="text-sm text-black-400 mb-8 text-[#6c6c6c]">
          <Translate
            text="Discover and test the latest in AI-Generated Media Creation built
          specifically for real estate. Use credits to upload and process images with unlimited revisions.."
          />
        </p>
        <h2 className="text-2xl mb-2 font-[500] text-[#333333] !font-allround">
          <Translate text="AI Photo Improvement" />
        </h2>
        <p className="text-sm text-black-400 mb-4 text-[#6c6c6c]">
          <Translate
            text="Instantly improve the quality of photos, enhance the brightness,
            replace the grass or sky, virtual stage, renovate or remove unwanted
            objects to further increase buyer engagement."
          />
        </p>
        <div className="bg-white rounded-lg">
          <div className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 gap-6">
            {filteredServices.map((service) =>
              service.isModelTraning ? (
                <div
                  key={service.name}
                  className="!bg-mainColor rounded-[15px] shadow-[2px_2px_30px_#33333318] border border-[#f3f3f3] transition-transform duration-500 hover:scale-105"
                >
                  <div className="relative w-full h-[180px]">
                    <img
                      src={service.image}
                      className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="!text-white text-center">
                        <h3 className="text-2xl font-[400] mb-2">
                          <Translate text="Model is in training!" />
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="flex !text-white group-hover:!text-black transition-all">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center">
                      {service.icon}
                    </div>
                    <p className="text-base flex items-center justify-center font-bold">
                      <Translate text={service.name} />
                    </p>
                  </div>
                </div>
              ) : (
                <div key={service.name}>
                  <Link href={service.link}>
                    <div className="bg-Color rounded-[15px] shadow-[2px_2px_30px_#33333318] group hover:!bg-Color cursor-pointer overflow-hidden transition-transform duration-500 hover:scale-105">
                      <div className="flex items-center justify-center">
                        <img
                          src={service.image}
                          className="w-full h-[180px] object-cover"
                        />
                      </div>
                      <div className="flex py-[10px]">
                        <div className="w-10 h-8 rounded-full flex items-center justify-center !text-white group-hover:!text-white transition-all">
                          {service.icon}
                        </div>
                        <p className="text-base !text-white flex items-center justify-center font-[500] group-hover:!text-white transition-all">
                          <Translate text={`AI ${service.name}`} />
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>

        {/* <div className="text-sm text-black-400 my-20">
          <h2 className="text-2xl mb-2 font-[500] text-[#333333] !font-allround">
            <Translate text="AI Text Improvement" />
          </h2>
          <p className="text-sm text-black-400 mb-8 text-[#3c3c3c]">
            <Translate text="Instantly create catchy and engaging property descriptions" />
          </p>
          <div className="bg-white rounded-lg">
            <div className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 gap-6">
              {textServices.map((service) =>
                service.isModelTraning ? (
                  <div
                    key={service.name}
                    className="bg-thirdColor flex flex-col rounded-[15px] shadow-[2px_2px_30px_#33333318] border border-[#f3f3f3]"
                  >
                    <div className="relative w-full h-[180px]">
                      <img
                        src={service.image}
                        className="w-full h-full object-cover opacity-20"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="!text-black text-center">
                          <h3 className="text-2xl font-[400] mb-2">
                            <Translate text="Model is in training!" />
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="flex !text-black group-hover:!text-black transition-all !items-center !my-auto">
                      <div className="w-10 h-8 rounded-full flex items-center justify-center">
                        {service.icon}
                      </div>
                      <p className="text-base flex items-center justify-center font-bold">
                        <Translate text={service.name} />
                      </p>
                    </div>
                  </div>
                ) : (
                  <div key={service.name}>
                    <Link href={service.link}>
                      <div className="bg-thirdColor rounded-[5px] shadow-[2px_2px_30px_#33333318] group cursor-pointer overflow-hidden">
                        <div className="flex items-center justify-center">
                          <img
                            src={service.image}
                            className="w-full h-[180px] object-cover"
                          />
                        </div>
                        <div className="flex py-[10px]">
                          <div className="w-10 h-8 rounded-full flex items-center justify-center !text-black transition-all">
                            {service.icon}
                          </div>
                          <p className="text-base flex items-center justify-center font-bold transition-all">
                            <Translate text={`AI ${service.name}`} />
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
        </div> */}

        {/* <div className="text-sm text-black-400 mt-8">
          <h2 className="text-3xl mb-4 font-[500] text-[#333333] !font-allround">
            <Translate text="Coming Soon" />
          </h2>

          <div className="bg-white rounded-lg">
            <div className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 gap-8">
              {comingSoon.map((service) => (
                <div
                  key={service.name}
                  className="bg-fourthColor rounded-[15px] shadow-[2px_2px_30px_#33333318]  group border border-[#f3f3f3]"
                >
                  <div className="relative w-full h-[200px]">
                    <img
                      src={service.image}
                      className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="!text-black text-center">
                        <h3 className="text-2xl font-[600] mb-2">
                          <Translate text="Coming Soon!" />
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="flex !text-black group-hover:!text-black transition-all">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center">
                      {service.icon}
                    </div>
                    <p className="text-base flex items-center justify-center font-bold">
                      <Translate text={service.name} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}
      </div>
    </AuhtProvider>
  );
};

export default Home;
