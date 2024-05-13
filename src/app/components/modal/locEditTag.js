import React, { useState,useEffect } from "react";
import Axios from "@/util/axios";
export default function LocEditTagModal({ list, place, callbackFn }) {
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    console.log(place)
    var arr= {};
    place.tag.map((value) => {
      arr[value] = true
    })
    setCheckedItems(arr)
  },[])
  const handleCloseModal = (e) => {
    if (e.target.closest(".modal-box")) {
      return;
    }
    if (callbackFn) {
      callbackFn();
    }
  };

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [name]: checked,
    }));
  };

  const handleClick = async () => {
    const selectedTags = Object.keys(checkedItems).filter(
      (itemName) => checkedItems[itemName]
    );
    callbackFn(place,selectedTags);
  };

  return (
    <dialog className="modal modal-open" onClick={handleCloseModal}>
      <div className="modal-box max-w-sm pointer-events-auto">
        <div className="">
          {list.map((value, index) => (
            <label className="label cursor-pointer justify-normal gap-3" key={index}>
              <input
                type="checkbox"
                name={value}
                className="checkbox"
                checked={checkedItems[value] || false}
                onChange={handleChange}
              />
              <span className="label-text">{value}</span>
            </label>
          ))}
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn" onClick={handleClick}>
              적용
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
