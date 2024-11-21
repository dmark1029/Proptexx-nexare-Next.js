import React from "react";
import ModelsBody from "@/components/ModelsBody";
import {
  photoEnhancementImageUrlsBefore2,
  photoEnhancementImageUrlsBefore,
  photoEnhancementImageUrlsAfter,
  photoEnhancementImageUrlsAfter2,
} from "@/utils/imagesPath";

const Photoenhancement = () => {
  return (
    <ModelsBody
      model_name="enhancement"
      modelName="photo enhancement"
      NameModel="photoEnhancementCredit"
      imageUrlsBefore={photoEnhancementImageUrlsBefore}
      imageUrlsAfter={photoEnhancementImageUrlsAfter}
      imageUrlsAfter2={photoEnhancementImageUrlsAfter2}
      imageUrlsBefore2={photoEnhancementImageUrlsBefore2}
      toolSteps={[
        {
          image: "/photo1.png",
          title: "Click to upload image",
          des: "Add one image",
        },
        {
          image: "/photo2.png",
          title: "Download the AI Photo Enhancement image",
          des: "",
        },
      ]}
    />
  );
};

export default Photoenhancement;
