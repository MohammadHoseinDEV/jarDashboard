import React, { useEffect, useMemo, useState } from 'react';
import EditLoadingJsx from '../template/editLoadingJsx';
import { useGetProducts } from '../../../../product_wareHouse/Api/productsApi';
import { useUpdateloadingProducts } from '../../../Api/loadingProducts';

function EditLoading({
  openEditModal,
  setOpenEditModal,
  selectedLoading,
  setSelectedLoading,
}) {
  const [form, setForm] = useState({
    reportId: '',
    OutputNumber: 0,
    LoadingDate: '',
    VehicleNumber: 0,
    PalletCount: 0,
    ShiftName: '',
    ProductCode: '',
    ProductName: '',
    UnitsPerPallet: 0,
    Destination: '',
    LoadingStartTime: '',
    LoadingEndTime: '',
    VehicleFrontImage: null,
    VehicleRightImage: null,
    VehicleLeftImage: null,
    LabelImages: [],
    ProductNotBroken: true,
    LabelMatchesProduct: true,
    PalletPlasticAndStrapsHealthy: true,
    VehicleCoverAvailable: true,
    ReferralCode: 0,
  });

  useEffect(() => {
    if (!selectedLoading) return;

    setForm({
      reportId: selectedLoading?.id ?? '',
      OutputNumber: selectedLoading?.outputNumber ?? 0,
      LoadingDate: selectedLoading?.loadingDate ?? '',
      VehicleNumber: selectedLoading?.vehicleNumber ?? 0,
      PalletCount: selectedLoading?.palletCount ?? 0,
      ShiftName: selectedLoading?.shiftName ?? '',
      ProductCode: selectedLoading?.productCode ?? '',
      ProductName: selectedLoading?.productName ?? '',
      UnitsPerPallet: selectedLoading?.unitsPerPallet ?? 0,
      Destination: selectedLoading?.destination ?? '',
      LoadingStartTime: selectedLoading?.loadingStartTime ?? '',
      LoadingEndTime: selectedLoading?.loadingEndTime ?? '',
      VehicleFrontImage: selectedLoading?.vehicleFrontImage,
      VehicleRightImage: selectedLoading?.vehicleRightImage,
      VehicleLeftImage: selectedLoading?.vehicleLeftImage,
      LabelImages: selectedLoading?.labelImages,
      ProductNotBroken: selectedLoading?.productNotBroken ?? true,
      LabelMatchesProduct: selectedLoading?.labelMatchesProduct ?? true,
      PalletPlasticAndStrapsHealthy:
        selectedLoading?.palletPlasticAndStrapsHealthy ?? true,
      VehicleCoverAvailable: selectedLoading?.vehicleCoverAvailable ?? true,
      ReferralCode: selectedLoading?.referralCode ?? 0,
    });
  }, [selectedLoading, openEditModal]);

  const closeHandler = () => {
    setOpenEditModal(false);
    setSelectedLoading(null);
  };

  const { data: product } = useGetProducts({ pageSize: 10000000 });
  const [searchProducts, setSearchProducts] = useState('');

  const getProducts = useMemo(() => {
    const none = { id: '', name: 'انتخاب  محصول' };
    return [
      none,
      ...(product?.items ?? []).map((p) => ({
        id: p.id,
        name: p.productName,
        code: p.productCode,
        count: p.numberOfBottlesInPallet,
      })),
    ];
  }, [product]);

  const filterProducts = useMemo(() => {
    const q = searchProducts.trim().toLowerCase();
    if (!q) return getProducts;

    return getProducts.filter((p) => (p?.name || '').toLowerCase().includes(q));
  }, [searchProducts, getProducts]);

  const selectedProducts = useMemo(() => {
    return (
      getProducts.find((p) => p.code === form.ProductCode) || getProducts[0]
    );
  }, [getProducts, form.ProductCode]);

  const updateReport = useUpdateloadingProducts();

  const buildFormData = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'LabelImages') {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach((file) => {
            if (file instanceof File) formData.append('LabelImages', file);
          });
        }
        return;
      }

      if (
        ['VehicleFrontImage', 'VehicleRightImage', 'VehicleLeftImage'].includes(
          key
        )
      ) {
        if (value instanceof File) formData.append(key, value);
        return;
      }

      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    return formData;
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = buildFormData(form);

    updateReport.mutate(
      { id: selectedLoading?.id, form: formData },
      {
        onSuccess: () => {
          closeHandler();
        },
      }
    );
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex h-screen items-center justify-center overflow-auto p-4 transition-opacity duration-300 ${
        openEditModal
          ? 'pointer-events-auto opacity-100 '
          : 'pointer-events-none opacity-0'
      }`}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={closeHandler}
      />
      <div
        className={`no-scrollbar relative flex max-h-[90vh] max-w-[80vw] transform flex-col overflow-auto rounded-[15px] bg-linear-to-bl from-black to-gray-600 p-6 text-white shadow-2xl transition-all duration-300 max-2xl:scale-95 max-md:h-160 max-md:overflow-auto ${
          openEditModal
            ? ' translate-y-0 scale-100 opacity-100'
            : '-translate-y-10 scale-0 opacity-0'
        }`}
      >
        <EditLoadingJsx
          openEditModal={openEditModal}
          closeHandler={closeHandler}
          form={form}
          setForm={setForm}
          submitHandler={submitHandler}
          selectedLoading={selectedLoading}
          product={product}
          searchProducts={searchProducts}
          setSearchProducts={setSearchProducts}
          getProducts={getProducts}
          filterProducts={filterProducts}
          selectedProducts={selectedProducts}
        />
      </div>
    </div>
  );
}

export default EditLoading;
