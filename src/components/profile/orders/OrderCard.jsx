import moment from "moment/moment";
import React from "react";
import { Link } from "react-router-dom";
import { colorCodes } from "../../../utils/DefaultValues";

const OrderCard = ({ data }) => {
  const date = moment(data.orderDate).format("DD MMM YYYY, HH:mm");
  return (
    <div className="flex flex-col p-4 border border-greyLight rounded-sm">
      <div className="flex flex-row gap-4 justify-between border-b-greyLight pb-2 border-b ">
        <div className="flex flex-col gap-1">
          <h4 className="heading4">{data._id}</h4>
          <span className="text-sm text-textDim">{date}</span>
        </div>

        <div className="">
          <div className={`rounded-sm ${colorCodes[data.status]}`}>
            <span className="font-medium italic">{data.status}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-b border-b-greyLight pb-2 pt-2">
        {data.products.map((entry, key) => (
          <div className="flex flex-row gap-4 items-center" key={key}>
            <div className="h-[80px] w-[80px]">
              <img
                src={entry.imageUrl}
                alt=""
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <span
                className="text-sm text-bodyText font-medium"
                dangerouslySetInnerHTML={{
                  __html:
                    entry.title.length > 50
                      ? entry.title.substring(0, 50) + "..."
                      : entry.title,
                }}
              />
              <div className="flex flex-row justify-between items-center w-full">
                <span className="text-sm text-bodyText">
                  &#8377; {entry.price}
                </span>
                <span className="text-sm text-bodyText">
                  Qty: {entry.quantity}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-row justify-between items-center w-full gap-4 pt-2">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-textDim">{data.totalItems} items</span>
          <span className="font-medium">&#8377; {data.totalAmount}</span>
        </div>

        <Link to={`/profile/orders/${data._id}`} className="">
          <button className="py-1 px-4 border border-baseGreen text-baseGreen text-sm">
            Manage
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
