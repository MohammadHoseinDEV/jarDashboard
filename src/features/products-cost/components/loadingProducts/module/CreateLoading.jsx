import React, { useMemo, useState } from 'react';
import { useCreateLoadingProducts } from '../../../Api/loadingProducts';
import CreateLoadingJsx from '../template/CreateLoadingJsx';
import { useGetProducts } from '../../../../product_wareHouse/Api/productsApi';

const initialState = {
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
};

const imageFields = [
  'VehicleFrontImage',
  'VehicleRightImage',
  'VehicleLeftImage',
];

const buildFormData = (data, { includeImages }) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === 'LabelImages') {
      if (includeImages && Array.isArray(value) && value.length > 0) {
        value.forEach((file) => {
          if (file instanceof File) formData.append('LabelImages', file);
        });
      } else {
        formData.append('LabelImages', '');
      }
      return;
    }

    if (imageFields.includes(key)) {
      if (includeImages && value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, '');
      }
      return;
    }

    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  return formData;
};

function CreateLoading({ openCreateModal, setOpenCreateModal, profile }) {
  const [form, setForm] = useState(initialState);
  const [pageSize, setPageSize] = useState(10);

  const closeHandler = () => {
    setOpenCreateModal(false);
    setForm({
      ...initialState,
      ShiftName: profile?.data?.currentShift?.shiftName || '',
    });
  };

  const { data: product } = useGetProducts({ pageSize: 10000000 });
  const [searchProducts, setSearchProducts] = useState('');
  const getProducts = useMemo(() => {
    const none = { id: '', name: 'Product Selection' };
    return [
      none,
      ...(product?.items ?? [])?.map((p) => ({
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

    return getProducts.filter(
      (p) =>
        (p?.name || '').toLowerCase().includes(q) ||
        (p?.code || '').toLowerCase().includes(q)
    );
  }, [searchProducts, getProducts]);

  const selectedProducts = useMemo(() => {
    return getProducts.find((p) => p.id === (form.id || '')) || getProducts[0];
  }, [getProducts, form.id]);

  const createReport = useCreateLoadingProducts();
  const toHHmmss = (value) => (value ? `${value}:00` : '');

  const submitHandler = (e) => {
    e.preventDefault();

    const data = {
      ...form,
      LoadingStartTime: toHHmmss(form.LoadingStartTime),
      LoadingEndTime: toHHmmss(form.LoadingEndTime),
    };

    const formData = buildFormData(data, { includeImages: false });

    createReport.mutate(formData, {
      onSuccess: () => {
        closeHandler();
      },
    });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex h-screen items-center justify-center overflow-auto p-4 transition-opacity duration-300 ${
        openCreateModal
          ? 'pointer-events-auto opacity-100 '
          : 'pointer-events-none opacity-0'
      }`}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={closeHandler}
      />
      <div
        className={`relative flex max-h-[90vh] min-h-0 max-w-[80vw] transform flex-col overflow-hidden rounded-[15px] bg-linear-to-bl from-black to-gray-600 p-6 text-white shadow-2xl transition-all duration-300 max-2xl:scale-95 max-md:h-160 ${
          openCreateModal
            ? 'translate-y-0 scale-100 opacity-100'
            : '-translate-y-10 scale-0 opacity-0'
        }`}
      >
        <CreateLoadingJsx
          closeHandler={closeHandler}
          form={form}
          setForm={setForm}
          submitHandler={submitHandler}
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

export default CreateLoading;
