import React from "react";
import ModelsBody from "@/components/ModelsBody";
import {
  skyReplacementImageUrlsBefore2,
  skyReplacementImageUrlsBefore,
  skyReplacementImageUrlsAfter,
  skyReplacementImageUrlsAfter2,
} from "@/utils/imagesPath";

const SkyReplacement = () => {
  return (
    <ModelsBody
      model_name="sky"
      modelName="sky replacement"
      NameModel="skyReplacementCredit"
      imageUrlsBefore={skyReplacementImageUrlsBefore}
      imageUrlsAfter={skyReplacementImageUrlsAfter}
      imageUrlsAfter2={skyReplacementImageUrlsAfter2}
      imageUrlsBefore2={skyReplacementImageUrlsBefore2}
      toolSteps={[
        {
          image: "/sky1.png",
          title: "Click to upload image",
          des: "Add one image",
        },
        {
          image: "/sky2.png",
          title: "Download the AI Sky Replacement image",
          des: "",
        },
      ]}
    />
  );
};

export default SkyReplacement;
