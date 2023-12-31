import React, { useState } from "react";
import { FiCheckCircle, FiDownload, FiXCircle } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelOrder,
  getCancelStatus,
} from "../../../../redux/slice/myOrderSlice";
import { ImSpinner2 } from "react-icons/im";
import { PRIVATE_API } from "../../../../api/apiIndex";

const OrderActions = ({ orderStatus, id }) => {
  const dispatch = useDispatch();

  const status = useSelector(getCancelStatus);

  const [cancelOrderActive, setCancelOrderActive] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("idle");

  const handleCancel = async () => {
    await dispatch(cancelOrder(id)).unwrap();
    setCancelOrderActive(false);
  };

  const handleInvoiceDownload = async () => {
    try {
      setDownloadStatus("loading");
      const invoice = await PRIVATE_API.get(`/order/invoice/${id}`, {
        responseType: "blob",
      });
      window.open(URL.createObjectURL(invoice.data));
      setDownloadStatus("success");
    } catch (err) {
      console.log(err);
      setDownloadStatus("failed");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="py-2 border-b border-b-greyLight">
        <h3 className="heading4">Actions</h3>
      </div>

      {cancelOrderActive ? (
        <div className="flex flex-col sm:gap-4 gap-3">
          <p className="text-uiBlack font-medium">
            Are you sure you want to cancel the order?
          </p>
          <div className="flex flex-row gap-4 flex-1 h-min">
            <button
              type="button"
              onClick={() => setCancelOrderActive(false)}
              className="text-uiBlack border-uiGrey border py-2 px-4 rounded-sm hover:bg-greyLight transition-all duration-150 flex items-center justify-center gap-2"
            >
              <FiXCircle />
              <span className="text-sm">Cancel</span>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="text-uiWhite border-uiRed bg-uiRed border py-2 px-4 rounded-sm transition-all duration-150 flex items-center justify-center gap-2 min-w-[100px]"
            >
              {status == "loading" ? (
                <ImSpinner2 className="animate-spin" />
              ) : (
                <>
                  <FiCheckCircle />
                  <span className="text-sm">Confirm</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-row gap-4">
          {orderStatus === "Delivered" ? (
            <button
              type="button"
              onClick={handleInvoiceDownload}
              className="primary-button font-normal py-2 px-4"
              disabled={downloadStatus === "loading"}
            >
              {downloadStatus === "loading" ? (
                <ImSpinner2 className="animate-spin" />
              ) : (
                <p className="flex flex-row items-center gap-2">
                  <span>Invoice</span>
                  <FiDownload />
                </p>
              )}
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setCancelOrderActive(true)}
            className="bg-uiRed border border-uiRed text-uiWhite text-sm py-2 px-4 rounded-sm disabled:bg-uiRed/40 disabled:border-uiRed/20"
            disabled={orderStatus !== "Placed"}
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderActions;
