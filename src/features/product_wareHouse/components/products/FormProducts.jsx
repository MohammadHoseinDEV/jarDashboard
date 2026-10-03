import { useEffect, useState } from 'react';

import { useGetProfile } from '../../../../hooks/profile/profile';
import { useShowSignutare } from '../../Api/productsApi';
import { toShamsi } from '../../../../Time/date';
import API_HOST from '../../../../../API/api';

import logo from '../../../../assets/images/kaveh.png';
import close from '../../../../assets/images/close.png';
import { CloudSnow } from 'lucide-react';

function FormProducts({
  openForm,
  setOpenForm,
  setSelectedProducts,
  seledtedProducts,
}) {
  const img = seledtedProducts?.productImagePath
    ? `${API_HOST}:5258/${seledtedProducts.productImagePath}`
    : null;

  const imgs = seledtedProducts?.certificateImagePath
    ? `${API_HOST}:5258/${seledtedProducts.certificateImagePath}`
    : null;

  const closeHandler = () => {
    setOpenForm(false);
    setSelectedProducts(null);
  };

  const { data } = useGetProfile();

  const showSignature = useShowSignutare();

  return (
    <div>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
          openForm
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0 print:pointer-events-auto! print:opacity-100!'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          onClick={closeHandler}
        />
        <div
          className={`relative transform rounded-[15px] bg-white p-3 text-white shadow-2xl transition-all duration-300 ${
            openForm
              ? 'max-3xl:scale-60 5xl:scale-110 translate-y-0 scale-75 opacity-100 max-2xl:scale-55 max-md:ml-9 max-md:scale-45 print:mx-auto print:scale-90 print:shadow-none '
              : '-translate-y-10 scale-0 opacity-0'
          }`}
        >
          <div>
            <div
              className="border border-black bg-white text-black"
              style={{ width: '210mm', minHeight: '294mm' }}
            >
              {/* header */}
              <div className="grid grid-cols-5 border-b">
                <div className="border-l py-1 pl-1 text-[15px]" dir="ltr">
                  <p className="space-x-1">
                    <span className="font-[AvenirLTProMedium]">Doc no :</span>
                    <span className="font-[AvenirLTProMedium]">SJ-S-07-01</span>
                  </p>
                  <p className="space-x-1">
                    <span className="font-[AvenirLTProMedium]">Rev no :</span>
                    <span className="font-[AvenirLTProMedium]">00</span>
                  </p>
                  <p className="space-x-1">
                    <span className="font-[AvenirLTProMedium]">Date :</span>
                    <span className="font-[AvenirLTProMedium]">1405/03/25</span>
                  </p>
                </div>
                <div className="col-span-3 flex items-center justify-center border-l text-[18px] font-extrabold">
                  PACKAGING STANDARD
                </div>
                <div className="flex items-center justify-center">
                  <img src={logo} alt="logo" width={70} />
                </div>
              </div>
              <div className="grid grid-cols-5">
                <div className="text-center">
                  <p className="flex h-[30px] items-center justify-center border-b border-l pl-1 font-[AvenirLTProMedium] text-[13px]">
                    {seledtedProducts?.numberOfBottlesInPallet !== 0 ? (
                      <span>{seledtedProducts?.numberOfBottlesInPallet}</span>
                    ) : (
                      ''
                    )}
                  </p>
                  <p className="flex h-[30px] items-center justify-center border-b border-l pl-1 font-[AvenirLTProMedium] text-[13px]">
                    {seledtedProducts?.numberOfLayers !== 0 ? (
                      <span>{seledtedProducts?.numberOfLayers}</span>
                    ) : (
                      ''
                    )}
                  </p>
                  <p className="flex h-[30px] items-center justify-center border-b border-l pl-1 font-[AvenirLTProMedium] text-[13px]">
                    {seledtedProducts?.bottlesPerLayer !== 0 ? (
                      <span>{seledtedProducts?.bottlesPerLayer}</span>
                    ) : (
                      ''
                    )}
                  </p>
                  <p className="flex h-[30px] items-center justify-center border-b border-l pl-1 font-[AvenirLTProMedium] text-[13px]">
                    {seledtedProducts?.typeOfArrangement}
                  </p>
                  <p className="flex h-[30px] items-center justify-center border-b border-l pl-1 font-[AvenirLTProMedium] text-[13px]">
                    {seledtedProducts?.topLayerPosition}
                  </p>
                  <p className="flex h-[30px] items-center justify-center border-b border-l pl-1 font-[AvenirLTProMedium] text-[13px]">
                    {seledtedProducts?.bottomLayerPosition}
                  </p>
                  <p className="flex h-[30px] items-center justify-center border-b border-l pl-1 font-[AvenirLTProMedium] text-[13px]">
                    {seledtedProducts?.separatorLayer}
                  </p>
                </div>
                <div className="col-span-3">
                  <div className="grid grid-cols-2">
                    <div dir="ltr" className="border-l">
                      <p className="flex h-[30px] items-center border-b bg-black/20 pl-1 text-[13px]">
                        Number of bottles in the pallet
                      </p>
                      <p className="flex h-[30px] items-center border-b bg-black/20 pl-1 text-[13px]">
                        Number Of layers
                      </p>
                      <p className="flex h-[30px] items-center border-b bg-black/20 pl-1 text-[13px]">
                        bottels per layer
                      </p>
                      <p className="flex h-[30px] items-center border-b bg-black/20 pl-1 text-[13px]">
                        Type of arrangement
                      </p>
                      <p className="flex h-[30px] items-center border-b bg-black/20 pl-1 text-[13px]">
                        Layer on the Top
                      </p>
                      <p className="flex h-[30px] items-center border-b bg-black/20 pl-1 text-[13px]">
                        Layer at the bottom
                      </p>
                      <p className="flex h-[30px] items-center border-b bg-black/20 pl-1 text-[13px]">
                        Seperator layer
                      </p>
                    </div>
                    <div className="border-l text-center" dir="ltr">
                      <p className="flex h-[30px] items-center justify-center border-b pl-1 font-[AvenirLTProMedium] text-[13px]">
                        {seledtedProducts?.productCode}
                      </p>
                      <p className="flex h-[30px] items-center justify-center border-b pl-1 font-[AvenirLTProMedium] text-[13px]">
                        {seledtedProducts?.productName}
                      </p>
                      <p className="flex h-[30px] items-center justify-center border-b pl-1 font-[AvenirLTProMedium] text-[13px]">
                        {seledtedProducts?.market ||
                        seledtedProducts?.customer !== '' ? (
                          <span>
                            {`${seledtedProducts?.market} / ${seledtedProducts?.customer}`}
                          </span>
                        ) : (
                          ''
                        )}
                      </p>
                      <p className="flex h-[30px] items-center justify-center border-b pl-1 font-[AvenirLTProMedium] text-[13px]">
                        {seledtedProducts?.brimfulCapacity ||
                        seledtedProducts?.brimfulCapacityTolerance !== 0 ? (
                          <span>
                            {`${seledtedProducts?.brimfulCapacity} ± ${seledtedProducts?.brimfulCapacityTolerance}   cc`}
                          </span>
                        ) : (
                          ''
                        )}
                      </p>
                      <p className="flex h-[30px] items-center justify-center border-b pl-1 font-[AvenirLTProMedium] text-[13px]">
                        {seledtedProducts?.weight ||
                        seledtedProducts?.weightTolerance !== 0 ? (
                          <span>
                            {`${seledtedProducts?.weight} ± ${seledtedProducts?.weightTolerance}   cc`}
                          </span>
                        ) : (
                          ''
                        )}
                      </p>
                      <p className="flex h-[30px] items-center justify-center border-b pl-1 font-[AvenirLTProMedium] text-[13px]">
                        {seledtedProducts?.diameter ||
                        seledtedProducts?.diameterTolerance !== 0 ? (
                          <span>{`${seledtedProducts?.diameter} ± ${seledtedProducts?.diameterTolerance} mm`}</span>
                        ) : (
                          ''
                        )}
                      </p>
                      <p className="flex h-[30px] items-center justify-center border-b pl-1 font-[AvenirLTProMedium] text-[13px]">
                        {seledtedProducts?.height ||
                        seledtedProducts?.heightTolerance !== 0 ? (
                          <span>{`${seledtedProducts?.height} ± ${seledtedProducts?.heightTolerance} mm`}</span>
                        ) : (
                          ''
                        )}
                      </p>
                      <p className="flex h-[30px] items-center justify-center border-b pl-1 font-[AvenirLTProMedium] text-[13px]">
                        {seledtedProducts?.color}
                      </p>
                      <p className="flex h-[30px] items-center justify-center border-b pl-1 font-[AvenirLTProMedium] text-[13px]">
                        {seledtedProducts?.finish !== '' ? (
                          <span>{`${seledtedProducts?.finish} mm`}</span>
                        ) : (
                          ''
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="" dir="ltr">
                  <p className="flex h-[30px] items-center justify-start border-b bg-black/20 pl-1 text-[13px]">
                    Product Code
                  </p>
                  <p className="flex h-[30px] items-center justify-start border-b bg-black/20 pl-1 text-[13px]">
                    Product Name
                  </p>
                  <p className="flex h-[30px] items-center justify-start border-b bg-black/20 pl-1 text-[13px]">
                    Market / Customer
                  </p>
                  <div className="grid grid-cols-3">
                    <p className="flex items-center justify-center border-r border-b bg-black/20 px-1 text-center text-[13px]">
                      product Data
                    </p>
                    <p className="col-span-2 flex w-full flex-col bg-black/20 text-center">
                      <span className="flex h-[30px] items-center border-b pl-1 text-[13px]">
                        Brimful capacity
                      </span>
                      <span className="flex h-[30px] items-center border-b pl-1 text-[13px]">
                        Weight
                      </span>
                      <span className="flex h-[30px] items-center border-b pl-1 text-[13px]">
                        Diameter
                      </span>
                      <span className="flex h-[30px] items-center border-b pl-1 text-[13px]">
                        Height
                      </span>
                      <span className="flex h-[30px] items-center border-b pl-1 text-[13px]">
                        colour
                      </span>
                      <span className="flex h-[30px] items-center border-b pl-1 text-[13px]">
                        finish
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2">
                {/* عکس محصول */}
                <div className="grid grid-cols-2 border-b border-l">
                  <p className="flex items-center justify-center">
                    <img
                      src={img}
                      alt="products"
                      className="fixed top-[303.5px] right-3 h-[270px] w-[95px] print:scale-95"
                    />
                  </p>
                  <p className="flex items-center justify-center">
                    <img
                      src={imgs}
                      alt="Certificate"
                      className="fixed top-[303px] right-27 h-[271px] w-[300px] print:scale-95"
                    />
                  </p>
                </div>
                <div className="grid grid-cols-5">
                  <div
                    className="col-span-3 border-b border-l text-center"
                    dir="ltr"
                  >
                    <p className="h-8 border-b py-1.5 pl-1 font-[AvenirLTProMedium] text-[13px]">
                      {seledtedProducts?.palletDimensionLength ||
                      seledtedProducts?.palletDimensionWidth ||
                      seledtedProducts?.palletDimensionHeight !== 0 ? (
                        <span>{`${seledtedProducts?.palletDimensionLength} x ${seledtedProducts?.palletDimensionWidth} x ${seledtedProducts?.palletDimensionHeight} mm`}</span>
                      ) : (
                        ''
                      )}
                    </p>
                    <p className="flex h-[30px] items-center justify-center border-b pl-1 font-[AvenirLTProMedium] text-[13px]">
                      {seledtedProducts?.palletVolume !== 0 ? (
                        <span>{`${seledtedProducts?.palletVolume} m³`}</span>
                      ) : (
                        ''
                      )}
                    </p>
                    <p className="flex h-[30px] items-center justify-center border-b pl-1 font-[AvenirLTProMedium] text-[13px]">
                      {seledtedProducts?.palletTotalWeight !== 0 ? (
                        <span>{`${seledtedProducts?.palletTotalWeight} kg`}</span>
                      ) : (
                        ''
                      )}
                    </p>
                    <p className="flex h-[30px] items-center justify-center border-b pl-1 font-[AvenirLTProMedium] text-[13px]">
                      {seledtedProducts?.palletBottlesWeight !== 0 ? (
                        <span>{`${seledtedProducts?.palletBottlesWeight} kg`}</span>
                      ) : (
                        ''
                      )}
                    </p>
                    <p className="flex h-[30px] items-center justify-center border-b pl-1 font-[AvenirLTProMedium] text-[13px]">
                      {seledtedProducts?.palletPackingWeight !== 0 ? (
                        <span>{`${seledtedProducts?.palletPackingWeight} ± ${seledtedProducts?.weightOfPackingTolerance} kg`}</span>
                      ) : (
                        ''
                      )}
                    </p>
                    <p className="flex h-[30px] items-center justify-center border-b pl-1 font-[AvenirLTProMedium] text-[13px]">
                      {seledtedProducts?.numberOfBottlesIn1Ton !== 0 ? (
                        <span>{seledtedProducts?.numberOfBottlesIn1Ton}</span>
                      ) : (
                        ''
                      )}
                    </p>
                    <p className="flex h-[30px] items-center justify-center pl-1 font-[AvenirLTProMedium] text-[13px]">
                      {seledtedProducts?.numberOfBottlesIn1M3 !== 0 ? (
                        <span>{seledtedProducts?.numberOfBottlesIn1M3}</span>
                      ) : (
                        ''
                      )}
                    </p>
                  </div>
                  <div className="col-span-2 flex" dir="ltr">
                    <div className="grid grid-cols-3">
                      <p className="flex items-center justify-center border-r border-b bg-black/20 py-1 pl-1 text-center text-[13px]">
                        loaded pallet
                      </p>
                      <p className="col-span-2 flex flex-col border-b">
                        <span className="flex h-[30px] items-center bg-black/20 px-1 text-[12px]">
                          Dimension
                        </span>
                        <span className="flex h-[30px] items-center bg-black/20 px-1 text-[12px]">
                          Volume
                        </span>
                        <span className="flex h-[30px] items-center bg-black/20 px-1 text-[12px]">
                          Total weight
                        </span>
                        <span className="flex h-[31px] items-center bg-black/20 px-1 text-[12px]">
                          Weight of bottles
                        </span>
                        <span className="flex h-[31px] items-center bg-black/20 px-1 text-[11px]">
                          Weight of packing
                        </span>
                      </p>
                      <p className="col-span-3 flex h-[30px] items-center border-b bg-black/20 pl-1 font-[AvenirLTProMedium] text-[12px]">
                        Number of bottles in 1 ton
                      </p>
                      <p className="col-span-3 flex h-[30px] items-center border-b bg-black/20 pl-1 font-[AvenirLTProMedium] text-[12px]">
                        Number of bottles in 1 m3
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-b bg-black/20 py-1 text-center font-[SamimBold]">
                REQUIRED PACKAGING MATERIALS FOR A PALLET
              </div>
              {/* Line 1 */}
              <div className="flex">
                {/* UNIT */}
                <div className="w-[100px]">
                  <p className="flex items-center justify-center border-b bg-black/20 py-1 font-[SamimBold] text-[13px]">
                    UNIT
                  </p>
                  <p className="flex h-11 items-center justify-center border-b">
                    {seledtedProducts?.packagingMaterials[0]?.unit}
                  </p>
                </div>
                {/* QUANTITY */}
                <div className="w-[75px]">
                  <p className="flex items-center justify-center border-r border-b bg-black/20 py-1 font-[SamimBold] text-[13px]">
                    QUANTITY
                  </p>
                  <p className="flex h-11 items-center justify-center border-r border-b font-[AvenirLTProMedium]">
                    {seledtedProducts?.packagingMaterials[0]?.quantity}
                  </p>
                </div>
                {/* DIMENSIONS */}
                <div className="w-40">
                  <p className="flex items-center justify-center border-r border-b bg-black/20 py-1 font-[SamimBold] text-[13px]">
                    DIMENSIONS
                  </p>
                  <p
                    dir="ltr"
                    className="flex h-11 items-center justify-center border-r border-b pl-1 font-[AvenirLTProMedium] text-[13px]"
                  >
                    {seledtedProducts?.packagingMaterials[0]?.dimensions}
                  </p>
                </div>
                {/* QUALITY */}
                <div className="w-[310px]">
                  <p className="flex items-center justify-center border-r border-b bg-black/20 py-1 font-[SamimBold] text-[13px]">
                    QUALITY
                  </p>
                  <div
                    className="flex h-11 flex-col space-y-1 border-r border-b py-0.5 pl-1"
                    dir="ltr"
                  >
                    <p className="space-x-1 text-[12px]">
                      {seledtedProducts?.packagingMaterials[0]?.materialType ? (
                        <span>TYPE :</span>
                      ) : (
                        ''
                      )}
                      <span>
                        {seledtedProducts?.packagingMaterials[0]?.materialType}
                      </span>
                    </p>
                    <p className="space-x-1 text-[12px]">
                      <span>
                        {seledtedProducts?.packagingMaterials[0]?.quality || ''}
                      </span>
                    </p>
                  </div>
                </div>
                {/* MATERIAL */}

                <div className="w-[200px] text-center">
                  <p className="border-r border-b bg-black/20 py-1 font-[SamimBold] text-[13px]">
                    MATERIAL
                  </p>

                  <p className="flex h-11 items-center justify-end border-r border-b py-4 pl-1 text-left text-[12px]">
                    {seledtedProducts?.packagingMaterials[0]?.materialName}
                  </p>
                </div>
              </div>
              {Array.from({ length: 12 }).map((_, index) => {
                const item = seledtedProducts?.packagingMaterials?.slice(
                  1,
                  13
                )?.[index];
                return (
                  <div key={index} className="flex h-8 text-left text-[13px]">
                    <p className="flex w-[100px] items-center justify-center border-b">
                      {item?.unit}
                    </p>
                    <p className="flex w-[75px] items-center justify-center border-r border-b font-[AvenirLTProMedium]">
                      {item?.quantity}
                    </p>
                    <p
                      className="flex w-40 items-center justify-center border-r border-b font-[AvenirLTProMedium]"
                      dir="ltr"
                    >
                      {item?.dimensions}
                    </p>
                    <p className="flex w-[310px] items-center justify-end border-r border-b pl-1 font-[AvenirLTProMedium]">
                      {item?.quality}
                    </p>
                    <p className="flex w-[199px] items-center justify-end border-r border-b pl-1">
                      {item?.materialName}
                    </p>
                  </div>
                );
              })}

              <div className="flex h-7">
                <p className="flex w-[110px] items-center justify-center border-b bg-black/20 font-[SamimBold] text-[12px]">
                  Customer
                </p>
                <p className="flex w-[220px] items-center justify-center border-r border-b bg-black/20 font-[SamimBold] text-[12px]">
                  Department manager
                </p>
                <p className="flex w-[220px] items-center justify-center border-r border-b bg-black/20 font-[SamimBold] text-[12px]">
                  Manufacturer
                </p>
                <p className="flex w-[130px] items-center justify-center border-r border-b bg-black/20 font-[SamimBold] text-[12px]">
                  APPROVED BY
                </p>
                <p
                  dir="ltr"
                  className="flex w-[250px] items-center justify-center border-r border-b bg-black/20 font-[SamimBold] text-[12px]"
                >
                  PREPARD BY
                </p>
              </div>
              <div className="flex">
                <div className="w-[110px]">
                  <p className="flex h-8 items-center justify-center border-b"></p>
                  <p className="flex h-17 items-center justify-center"></p>
                </div>
                {/* Manufacturer */}
                <div className="w-[220px] border-r">
                  <p className="flex h-8 items-center justify-center border-b"></p>
                  <p className="flex h-17 items-center justify-center"></p>
                </div>
                {/* Department  manager */}
                <div className="w-[220px] border-r">
                  <p className="flex h-8 items-center justify-center border-b"></p>
                  <p className="flex h-17 items-center justify-center"></p>
                </div>
                {/* APPROVED BY */}
                <div className="w-[130px] border-r">
                  <p className="flex h-8 items-center justify-center border-b">
                    Date
                  </p>
                  <p className="flex h-17 items-center justify-center">
                    Signature
                  </p>
                </div>
                {/* PREPARD BY */}
                <div className="flex h-25 w-[250px] justify-end border-r text-left">
                  <div className="w-[70%]">
                    <p className="flex h-8 items-center justify-center border-b">
                      {seledtedProducts?.preparedBy}
                    </p>
                    <p className="flex h-9 items-center justify-center border-b font-[AvenirLTProMedium]">
                      {seledtedProducts?.revisionNumber}
                    </p>
                    <p className="flex h-8 items-center justify-center font-[AvenirLTProMedium]">
                      {toShamsi(seledtedProducts?.updatedAt)}
                    </p>
                  </div>
                  <div className="w-[30%] border-r">
                    <p className="flex h-8 items-center justify-end border-b px-1">
                      : Name
                    </p>
                    <p className="flex h-9 items-center justify-end border-b px-1">
                      : Rev
                    </p>
                    <p className="flex h-8 items-center justify-end px-1">
                      : Date
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormProducts;
