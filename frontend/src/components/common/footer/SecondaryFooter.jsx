import React from "react";
import { crypto, stripe } from "../../../assets";

const SecondaryFooter = () => {
  return (
    <div className="py-[2rem] flex-col gap-3">
      <div className="flex sm:flex-row flex-col gap-4 justify-between items-center">
        <div className="text-center">
          <p className="text-uiBlack text-sm">
            Developed as part of CAPSTONE PROJECT at VIT by Sulav Giri
            (19BCE2645) and Madhav S. Panicker (19BCE2005)
          </p>
        </div>

        <div className="flex flex-row gap-3 h-[32px]">
          <img src={stripe} className="h-full object-contain" />
          <img src={crypto} className="h-full object-contain" />
        </div>
      </div>
    </div>
  );
};

export default SecondaryFooter;
