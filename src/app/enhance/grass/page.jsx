import React from "react";
import ModelsBody from "@/components/ModelsBody";
import {
  grassRepairImageUrlsBefore2,
  grassRepairImageUrlsBefore,
  grassRepairImageUrlsAfter,
  grassRepairImageUrlsAfte2,
} from "@/utils/imagesPath";

const GrassRepair = () => {
  return (
    <ModelsBody
      model_name="grass"
      modelName="grass repair"
      NameModel="grassRepairCredit"
      imageUrlsBefore={grassRepairImageUrlsBefore}
      imageUrlsAfter={grassRepairImageUrlsAfter}
      imageUrlsAfter2={grassRepairImageUrlsAfte2}
      imageUrlsBefore2={grassRepairImageUrlsBefore2}
      toolSteps={[
        {
          image: "/grass1.png",
          title: "Click to upload image",
          des: "Add one image",
        },
        {
          image: "/grass2.png",
          title: "Download the AI Grass Repair image.",
          des: "",
        },
      ]}
    />
  );
};

export default GrassRepair;
