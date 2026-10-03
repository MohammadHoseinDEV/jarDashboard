import { useState } from 'react';

import { useCreateProducts } from '../../Api/productsApi';
import { toast } from 'react-toastify';
import AddProductsJsx from '../template/AddProductsJsx';

const initialState = {
  productCode: '',
  productName: '',
  market: '',
  customer: '',
  brimfulCapacity: 0,
  brimfulCapacityTolerance: 0,
  weight: 0,
  weightTolerance: 0,
  diameter: 0,
  diameterTolerance: 0,
  height: 0,
  heightTolerance: 0,
  color: '',
  finish: '',
  palletDimensionLength: 0,
  palletDimensionWidth: 0,
  palletDimensionHeight: 0,
  palletVolume: 0,
  palletTotalWeight: 0,
  palletBottlesWeight: 0,
  palletPackingWeight: 0,
  weightOfPackingTolerance: 0,
  numberOfBottlesIn1Ton: 0,
  numberOfBottlesIn1M3: 0,
  numberOfBottlesInPallet: 0,
  numberOfLayers: 0,
  bottlesPerLayer: 0,
  typeOfArrangement: '',
  productType: true,
  topLayerPosition: '',
  bottomLayerPosition: '',
  separatorLayer: '',
  openingBalance: 0,
  preparedBy: '',
  revisionNumber: '',
  preparedDate: '',
  approvedBy: '',
  packagingMaterials: [
    {
      id: '',
      materialName: '',
      materialType: '',
      quality: '',
      dimensions: '',
      quantity: 0,
      unit: '',
      description: '',
    },
  ],
};

function AddProducts({ openCreateModal, setOpenCreateModal }) {
  const [form, setForm] = useState(initialState);

  const addPackagingMaterials = () => {
    if (form.packagingMaterials.length >= 13) {
      toast.warning('حداکثر 13 ردیف قابل اضافه کردن است');
      return;
    }
    setForm((prev) => ({
      ...prev,
      packagingMaterials: [
        ...(prev.packagingMaterials || []),
        {
          materialName: '',
          materialType: '',
          quality: '',
          dimensions: '',
          quantity: 0,
          unit: '',
          description: '',
        },
      ],
    }));
  };

  const removePackagingMaterials = (index) => {
    setForm((prev) => {
      const next = [...(prev.packagingMaterials || [])];
      next.splice(index, 1);
      if (next.length === 0) {
        next.push({
          materialName: '',
          materialType: '',
          quality: '',
          dimensions: '',
          quantity: 0,
          unit: '',
          description: '',
        });
      }
      return { ...prev, packagingMaterials: next };
    });
  };

  const closeHandler = () => {
    setOpenCreateModal(false);
  };

  const createProducts = useCreateProducts();

  const submitHandler = (e) => {
    e.preventDefault();

    if (!form.preparedDate) {
      toast.warning('لطفا تاریخ تاریخ تهیه شناسنامه را انتخاب کنید');
      return;
    }

    createProducts.mutate(form, {
      onSuccess: () => {
        closeHandler();
      },
    });
  };

  const inputHandler = (e) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
    }));
  };

  const packagingHandler = (e, index = 0) => {
    const { name, value, type } = e.target;

    setForm((prev) => {
      const updated = [...prev.packagingMaterials];

      updated[index] = {
        ...updated[index],
        [name]: type === 'number' ? (value === '' ? 0 : Number(value)) : value,
      };

      return {
        ...prev,
        packagingMaterials: updated,
      };
    });
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
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
          className={`max-3xl:scale-75 max-3xl:w-fit relative w-[85%] transform rounded-[15px] bg-linear-to-tl from-black to-gray-600 p-4 text-white shadow-2xl transition-all duration-300 max-2xl:w-fit max-2xl:scale-65 ${
            openCreateModal
              ? 'translate-y-0 scale-100 opacity-100'
              : '-translate-y-10 scale-0 opacity-0'
          }`}
        >
          <AddProductsJsx
            closeHandler={closeHandler}
            submitHandler={submitHandler}
            inputHandler={inputHandler}
            form={form}
            setForm={setForm}
            addPackagingMaterials={addPackagingMaterials}
            removePackagingMaterials={removePackagingMaterials}
            packagingHandler={packagingHandler}
          />
        </div>
      </div>
    </>
  );
}


export default AddProducts;
