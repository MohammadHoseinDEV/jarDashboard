import React from 'react';

import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

import close from '../../../../assets/images/close.png';

function AddProductsJsx({
  closeHandler,
  submitHandler,
  inputHandler,
  form,
  setForm,
  addPackagingMaterials,
  removePackagingMaterials,
  packagingHandler,
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="5xl:text-[30px] pr-1.5 pb-5 font-[SamimBold] text-[20px]">
          ایجاد شناسنامه محصول جدید
        </h2>
        <button
          onClick={closeHandler}
          className="cursor-pointer rounded-[10px] bg-white/80 p-1.5 text-[30px] text-red-500 transition-all delay-100 duration-75 ease-in-out hover:bg-black"
        >
          <img
            src={close}
            alt="close"
            width={25}
            className="transition-all delay-100 duration-100 ease-in-out hover:scale-110"
          />
        </button>
      </div>
      <form
        onSubmit={submitHandler}
        id="product"
        className="no-scrollbar 5xl:h-[900px] mt-5 grid h-[700px] grid-cols-4 gap-3 overflow-auto rounded-2xl border border-white/50 px-5 pt-5"
      >
        <span className="5xl:text-[30px] col-span-4 mb-3 p-1 font-[SamimBold] text-[20px]">
          اطلاعات پایه محصول
        </span>

        <label htmlFor="productCode" className="5xl:text-[25px]">
          کد محصول (Product Code)
          <input
            type="text"
            placeholder="79J4BmH1"
            name="productCode"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="productName" className="5xl:text-[25px]">
          نام محصول (productName)
          <input
            type="text"
            placeholder="130cc Jar TO58"
            name="productName"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="productType" className="5xl:text-[25px]">
          نوع محصول
          <select
            name="productType"
            onChange={(e) => {
              setForm((p) => ({
                ...p,
                productType: e.target.value === 'true',
              }));
            }}
            className="input-text"
          >
            <option value="" className="bg-black/80 font-[Samim]">
              انتخاب نوع محصول
            </option>
            <option value="true" className="bg-black/80 font-[Samim]">
              جار
            </option>
            <option value="false" className="bg-black/80 font-[Samim]">
              بطری
            </option>
          </select>
        </label>
        <label htmlFor="market" className="5xl:text-[25px]">
          بازار هدف (market)
          <input
            type="text"
            placeholder="market"
            name="market"
            onChange={inputHandler}
            className="input-text"
          />
        </label>
        <label htmlFor="customer" className="5xl:text-[25px]">
          مشتری مرتبط با این محصول (customer)
          <input
            type="text"
            placeholder="customer"
            name="customer"
            onChange={inputHandler}
            className="input-text"
          />
        </label>
        <span className="5xl:text-[30px] col-span-4 p-3 font-[SamimBold] text-[20px]">
          مشخصات فنی بطری
        </span>
        <label htmlFor="brimfulCapacity" className="5xl:text-[25px]">
          ظرفیت کامل بطری (brimfulCapacity)
          <input
            type="number"
            step="0.01"
            name="brimfulCapacity"
            placeholder="130"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label
          htmlFor="brimfulCapacityTolerance"
          className="5xl:text-[25px] max-2xl:text-[15px]"
        >
          تلورانس ظرفیت کامل بطری (brimfulCapacity)
          <input
            type="number"
            step="0.01"
            name="brimfulCapacityTolerance"
            placeholder="5"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="weight" className="5xl:text-[25px]">
          وزن بطری (weight)
          <input
            type="text"
            step="0.01"
            placeholder="120"
            name="weight"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="weightTolerance" className="5xl:text-[25px]">
          تلورانس وزن بطری (weight)
          <input
            type="text"
            step="0.01"
            placeholder="2"
            name="weightTolerance"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="diameter" className="5xl:text-[25px]">
          قطر بطری (diameter)
          <input
            type="number"
            step="0.01"
            placeholder="57"
            name="diameter"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="diameterTolerance" className="5xl:text-[25px]">
          تلورانس قطر بطری (diameter)
          <input
            type="number"
            step="0.01"
            placeholder="4"
            name="diameterTolerance"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="height" className="5xl:text-[25px]">
          ارتفاع بطری (height)
          <input
            type="number"
            step="0.01"
            placeholder="80"
            name="height"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="heightTolerance" className="5xl:text-[25px]">
          تلورانس ارتفاع بطری (height)
          <input
            type="number"
            step="0.01"
            placeholder="80"
            name="heightTolerance"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="color" className="5xl:text-[25px]">
          رنگ بطری (color)
          <input
            type="text"
            placeholder="flint"
            name="color"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="finish" className="5xl:text-[25px]">
          اندازه دهانه بطری (finish)
          <input
            type="text"
            placeholder="52.71"
            name="finish"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <span className="5xl:text-[30px] col-span-4 p-3 font-[SamimBold] text-[20px]">
          مشخصات پالت
        </span>
        <label htmlFor="palletDimensionLength" className="5xl:text-[25px]">
          طول پالت (palletDimensionLength)
          <input
            type="number"
            step="0.01"
            placeholder="1210"
            name="palletDimensionLength"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="palletDimensionWidth" className="5xl:text-[25px]">
          عرض پالت (palletDimensionWidth)
          <input
            type="number"
            step="0.01"
            placeholder="1010"
            name="palletDimensionWidth"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="palletDimensionHeight" className="5xl:text-[25px]">
          ارتفاع پالت (palletDimensionHeight)
          <input
            type="number"
            step="0.01"
            placeholder="1725"
            name="palletDimensionHeight"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="palletVolume" className="5xl:text-[25px]">
          حجم پالت (palletVolume)
          <input
            type="number"
            step="0.001"
            placeholder="2.108"
            name="palletVolume"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="palletTotalWeight" className="5xl:text-[25px]">
          وزن کل پالت (palletTotalWeight)
          <input
            type="number"
            step="0.01"
            placeholder="970"
            name="palletTotalWeight"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="palletBottlesWeight" className="5xl:text-[25px]">
          وزن بطری ها (palletBottlesWeight)
          <input
            type="number"
            step="0.01"
            placeholder="935"
            name="palletBottlesWeight"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label
          htmlFor="palletPackingWeight"
          className="5xl:text-[25px] max-2xl:text-[15px]"
        >
          وزن متریال بسته بندی (palletPackingWeight)
          <input
            type="number"
            step="0.01"
            placeholder="35"
            name="palletPackingWeight"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label
          htmlFor="weightOfPackingTolerance"
          className="5xl:text-[20px] max-2xl:text-[15px]"
        >
          تلورانس وزن متریال بسته بندی
          <input
            type="number"
            step="0.01"
            placeholder="35"
            name="weightOfPackingTolerance"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <span className="col-span-4 p-3 font-[SamimBold] text-[20px]">
          اطلاعات چیدمان بطری روی پالت
        </span>
        <label
          htmlFor="numberOfBottlesIn1Ton"
          className="5xl:text-[20px] max-2xl:text-[14px]"
        >
          تعداد بطری در یک تن (numberOfBottlesIn1Ton)
          <input
            type="number"
            step="0.01"
            placeholder="8075"
            name="numberOfBottlesIn1Ton"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label
          htmlFor="numberOfBottlesIn1M3"
          className="5xl:text-[20px] pt-[3px] text-[15px] max-2xl:text-[12px]"
        >
          تعداد بطری در یک متر مکعب (numberOfBottlesIn1M3)
          <input
            type="number"
            step="0.01"
            placeholder="4920"
            name="numberOfBottlesIn1M3"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label
          htmlFor="numberOfBottlesInPallet"
          className="5xl:text-[20px] max-2xl:text-[13px]"
        >
          تعداد بطری در هر پالت (numberOfBottlesInPallet)
          <input
            type="number"
            step="0.01"
            placeholder="7790"
            name="numberOfBottlesInPallet"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="numberOfLayers" className="5xl:text-[20px]">
          تعداد لایه ها (numberOfLayers)
          <input
            type="number"
            step="0.01"
            placeholder="19"
            name="numberOfLayers"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="bottlesPerLayer" className="5xl:text-[20px]">
          بطری در هر لایه (bottlesPerLayer)
          <input
            type="number"
            step="0.01"
            placeholder="410"
            name="bottlesPerLayer"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="typeOfArrangement" className="5xl:text-[20px]">
          نوع چیدمان (typeOfArrangement)
          <input
            type="text"
            placeholder="Wide side"
            name="typeOfArrangement"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="topLayerPosition" className="5xl:text-[20px]">
          وضعیت لایه بالا (topLayerPosition)
          <input
            type="text"
            placeholder="Top layer"
            name="topLayerPosition"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="bottomLayerPosition" className="5xl:text-[20px]">
          وضعیت لایه پایین (bottomLayerPosition)
          <input
            type="text"
            placeholder="bottom layer"
            name="bottomLayerPosition"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="separatorLayer" className="5xl:text-[20px]">
          لایه جدا کننده (separatorLayer)
          <input
            type="text"
            placeholder="Separator layer"
            name="separatorLayer"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <span className="5xl:text-[30px] col-span-4 p-3 font-[SamimBold] text-[20px]">
          اطلاعات مالی / انبار
        </span>
        <label htmlFor="openingBalance" className="5xl:text-[20px]">
          موجودی اولیه محصول در انبار
          <input
            type="number"
            step="0.01"
            placeholder="1000"
            name="openingBalance"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <span className="5xl:text-[30px] col-span-4 p-3 font-[SamimBold] text-[20px]">
          اطلاعات مستندسازی
        </span>
        <label htmlFor="preparedBy" className="5xl:text-[20px]">
          تهیه کننده (preparedBy)
          <input
            type="text"
            placeholder="FullName"
            name="preparedBy"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="revisionNumber" className="5xl:text-[20px]">
          شماره ریویژن (revisionNumber)
          <input
            type="text"
            placeholder="01"
            name="revisionNumber"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <label htmlFor="preparedDate" className="5xl:text-[20px] flex flex-col">
          تاریخ تهیه شناسنامه (preparedDate)
          <DatePicker
            calendar={persian}
            locale={persian_fa}
            format="YYYY/MM/DD"
            placeholder="1405/01/01"
            onChange={(value) => {
              setForm((p) => ({
                ...p,
                preparedDate: value ? value.toDate().toISOString() : '',
              }));
            }}
            inputClass="input-date"
          />
        </label>
        <label htmlFor="approvedBy" className="5xl:text-[20px]">
          تایید کننده (approvedBy)
          <input
            type="text"
            placeholder="FullName"
            name="approvedBy"
            onChange={inputHandler}
            className="input-number"
          />
        </label>
        <span className="5xl:text-[30px] col-span-2 p-3 font-[SamimBold] text-[20px]">
          مواد بسته‌بندی
        </span>

        {(form.packagingMaterials || []).map((item, index) => (
          <div
            key={index}
            className="col-span-4 grid grid-cols-4 gap-3 rounded-xl border border-white/20 p-3"
          >
            <label htmlFor="materialName" className="5xl:text-[20px]">
              نام متریال (materialName)
              <input
                type="text"
                placeholder="نام متریال"
                name="materialName"
                value={item.materialName}
                onChange={(e) => packagingHandler(e, index)}
                className="input-text"
              />
            </label>
            <label htmlFor="materialType" className="5xl:text-[20px]">
              نوع متریال (materialType)
              <input
                type="text"
                placeholder="نوع متریال"
                name="materialType"
                value={item.materialType}
                onChange={(e) => packagingHandler(e, index)}
                className="input-text"
              />
            </label>
            <label htmlFor="quality" className="5xl:text-[20px]">
              درجه کیفیت (quality)
              <input
                type="text"
                placeholder="درجه کیفیت"
                name="quality"
                value={item.quality}
                onChange={(e) => packagingHandler(e, index)}
                className="input-text"
              />
            </label>

            <label htmlFor="dimensions" className="5xl:text-[20px]">
              ابعاد (dimensions)
              <input
                type="text"
                placeholder="1000x1200x150"
                name="dimensions"
                value={item.dimensions}
                onChange={(e) => packagingHandler(e, index)}
                className="input-number"
              />
            </label>
            <label htmlFor="quantity" className="5xl:text-[20px]">
              مقدار مصرف (quantity)
              <input
                type="number"
                step="0.01"
                placeholder="1"
                name="quantity"
                onChange={(e) => packagingHandler(e, index)}
                className="input-number"
              />
            </label>
            <label htmlFor="unit" className="5xl:text-[20px]">
              واحد (unit)
              <input
                type="text"
                placeholder="pcs"
                name="unit"
                value={item.unit}
                onChange={(e) => packagingHandler(e, index)}
                className="input-number"
              />
            </label>
            {/* <input
                    type="text"
                    placeholder="توضیحات"
                    name="description"
                    value={item.description}
                    onChange={(e) => packagingHandler(e, index)}
                    className="w-full rounded-xl bg-white/10 p-3 font-[Samim] text-[18px] text-white outline-none"
                  /> */}
            <div className="col-span-4 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={addPackagingMaterials}
                className="add-line"
              >
                افزودن متریال
              </button>
              <button
                type="button"
                onClick={() => {
                  removePackagingMaterials(index);
                }}
                className="remove-line"
              >
                حذف متریال
              </button>
            </div>
          </div>
        ))}
      </form>
      <div className="col-span-4 flex items-center justify-end">
        <button type="submit" form="product" className="btn-submit">
          تایید
        </button>
      </div>
    </div>
  );
}

export default AddProductsJsx;
