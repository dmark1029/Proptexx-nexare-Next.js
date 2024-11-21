import { useState } from "react";
import Translate from "./Translate";

const FaqItem = ({ question, answer, index, selectedIndex, onSelect }) => {
  const isOpen = selectedIndex === index;

  return (
    <div
      className={
        "transition-all duration-200  cursor-pointer"
      }>
      <button
        type="button"
        className={`flex items-center justify-between w-full px-2  sm:!px-6 sm:!py-3 ${
          isOpen ? "bg-gray-200" : "text-black"
        }`}
        onClick={() => onSelect(index)}>
        <div className={`flex text-sm font-bold`}>{question}</div>
        <svg
          className={`w-6 h-6 text-gray-400 ${isOpen ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#000000">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={` ${
          isOpen ? "opacity-100 px-4 pb-5 sm:!px-6 sm:!pb-6" : "opacity-0 h-0"
        } transition-opacity duration-600`}>
        <p className="text-sm">
          <span className={`${isOpen ? "block" : "hidden"}`}>{answer}</span>
        </p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelectItem = (index) => {
    if (index === selectedIndex) {
      setSelectedIndex(-1); // Close the FAQ if the same one is clicked
    } else {
      setSelectedIndex(index);
    }
  };

  return (
    <section className="!mt-[160px]">
      <div className="">
        <div className="mx-auto text-center">
          <h2 className="text-[2rem] font-light text-gray-800 !font-allround">
            <Translate text="FAQs" />
          </h2>
        </div>
        <div className="mx-auto mt-4 space-y-2 md:!mt-6 bg-thirdColor border border-[#dbdbdb] py-[50px] px-[50px] rounded-[20px]">
          <FaqItem
            question={
              <Translate text="How do PropTexx subscriptions plan work?" />
            }
            answer={
              <Translate text="Our subscription plans provide the best deal on BASIC plans and include access to all photo generative products royalty free. By enrolling in a subscription, you will have a monthly credit allotment, of which credits are deducted for each download. This credit allotment resets each month at the end of each month’s credit cycle." />
            }
            index={0}
            selectedIndex={selectedIndex}
            onSelect={handleSelectItem}
          />

          <FaqItem
            question={<Translate text="How does auto renewal work?" />}
            answer={
              <Translate text="Our auto renewal feature ensures that your subscription automatically renews so you maintain uninterrupted service. You can easily manage your auto renewal settings on the My plan page." />
            }
            index={1}
            selectedIndex={selectedIndex}
            onSelect={handleSelectItem}
          />

          <FaqItem
            question={<Translate text="Can I upgrade or downgrade my plans?" />}
            answer={
              <Translate text="Ran out of your monthly allotment or need more or less downloads on a regular basis? We understand things change. You can always contact us and we’ll be happy to help." />
            }
            index={2}
            selectedIndex={selectedIndex}
            onSelect={handleSelectItem}
          />

          <FaqItem
            question={
              <Translate text="Can I cancel my plan If I do not need it anymore?" />
            }
            answer={
              <Translate text="For Monthly (no contract) subscriptions, you are free to cancel at any time by turning off auto renewal in your plan settings. Since you have already paid for the monthly subscription at the beginning of the billing cycle, you will still be able to use your remaining downloads or credits until the end of your billing cycle. If you need to terminate your Annual (billed monthly) subscription before the end of the 12 month term, you will be subject to a fee equivalent to the savings you received in comparison to the Monthly (no contract) plan rate. Please contact us for assistance with your cancellation or if you have any questions." />
            }
            index={3}
            selectedIndex={selectedIndex}
            onSelect={handleSelectItem}
          />

          <FaqItem
            question={
              <Translate text="Can I get a refund If I cancel my subscription?" />
            }
            answer={
              <Translate text="Yes absolutely. We have trust in our product. If you are not happy with it, we will refund you." />
            }
            index={4}
            selectedIndex={selectedIndex}
            onSelect={handleSelectItem}
          />
        </div>

        <p className="text-center text-gray-600 textbase mt-9">
          <Translate text="Didn’t find the answer you are looking for?" />{" "}
          <a
            href="mailto:support@proptexx.com"
            title=""
            className="font-medium text-black transition-all duration-200 hover:!text-black focus:text-black hover:!underline">
            <Translate text="Contact our support" />
          </a>
        </p>
      </div>
    </section>
  );
};

export default FAQ;
