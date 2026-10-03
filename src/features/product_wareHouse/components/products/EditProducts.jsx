import { useEffect, useState } from 'react';
import { useEditProducts } from '../../Api/productsApi';
import EditProductsJsx from '../template/EditProductsJsx';
import { toast } from 'react-toastify';

const initialState = {
  id: '',
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

function EditProducts({
  openEditModal,
  setOpenEditModal,
  selectedProducts,
  setSelectedProducts,
}) {
  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (!selectedProducts) return;
    setForm({
      id: selectedProducts?.id,
      productCode: selectedProducts?.productCode,
      productName: selectedProducts?.productName,
      market: selectedProducts?.market,
      customer: selectedProducts?.customer,
      brimfulCapacity: selectedProducts?.brimfulCapacity,
      brimfulCapacityTolerance: selectedProducts?.brimfulCapacityTolerance,
      weight: selectedProducts?.weight,
      weightTolerance: selectedProducts?.weightTolerance,
      diameter: selectedProducts?.diameter,
      diameterTolerance: selectedProducts?.diameterTolerance,
      height: selectedProducts?.height,
      heightTolerance: selectedProducts?.heightTolerance,
      productType: selectedProducts?.productType,
      color: selectedProducts?.color,
      finish: selectedProducts?.finish,
      palletDimensionLength: selectedProducts?.palletDimensionLength,
      palletDimensionWidth: selectedProducts?.palletDimensionWidth,
      palletDimensionHeight: selectedProducts?.palletDimensionHeight,
      palletVolume: selectedProducts?.palletVolume,
      palletTotalWeight: selectedProducts?.palletTotalWeight,
      palletBottlesWeight: selectedProducts?.palletBottlesWeight,
      palletPackingWeight: selectedProducts?.palletPackingWeight,
      weightOfPackingTolerance: selectedProducts?.weightOfPackingTolerance,
      numberOfBottlesIn1Ton: selectedProducts?.numberOfBottlesIn1Ton,
      numberOfBottlesIn1M3: selectedProducts?.numberOfBottlesIn1M3,
      numberOfBottlesInPallet: selectedProducts?.numberOfBottlesInPallet,
      numberOfLayers: selectedProducts?.numberOfLayers,
      bottlesPerLayer: selectedProducts?.bottlesPerLayer,
      typeOfArrangement: selectedProducts?.typeOfArrangement,
      topLayerPosition: selectedProducts?.topLayerPosition,
      bottomLayerPosition: selectedProducts?.bottomLayerPosition,
      separatorLayer: selectedProducts?.separatorLayer,
      openingBalance: selectedProducts?.openingBalance,
      preparedBy: selectedProducts?.preparedBy,
      revisionNumber: selectedProducts?.revisionNumber,
      preparedDate: selectedProducts?.preparedDate,
      approvedBy: selectedProducts?.approvedBy,
      packagingMaterials: selectedProducts?.packagingMaterials?.length
        ? selectedProducts.packagingMaterials.map((x) => ({
            id: x?.id,
            materialName: x?.materialName,
            materialType: x?.materialType,
            quality: x?.quality,
            dimensions: x?.dimensions,
            quantity: x?.quantity,
            unit: x?.unit,
            description: x?.description,
          }))
        : [
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
    });
  }, [selectedProducts, openEditModal]);

  const closeHandler = () => {
    setOpenEditModal(false);
    setSelectedProducts(null);
  };

  const inputHandler = (e) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

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

  const packagingHandler = (e, index = 0) => {
    const { name, value, type } = e.target;

    setForm((prev) => {
      const updated = [...prev.packagingMaterials];

      updated[index] = {
        ...updated[index],
        [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
      };

      return {
        ...prev,
        packagingMaterials: updated,
      };
    });
  };

  const editProducts = useEditProducts();

  const editHandler = (e) => {
    e.preventDefault();
    if (!selectedProducts?.id) return;

    editProducts.mutate(
      {
        id: selectedProducts.id,
        data: { ...form, id: selectedProducts.id },
      },
      {
        onSuccess: () => {
          closeHandler();
          setSelectedProducts(null);
        },
      }
    );
  };

  return (
    <div>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
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
          className={`max-3xl:scale-75 5xl:w-[85%] relative w-[1600px] transform rounded-[15px] bg-linear-to-tl from-black to-gray-600 p-4 text-white shadow-2xl transition-all duration-300 max-2xl:scale-65 ${
            openEditModal
              ? 'translate-y-0 scale-100 opacity-100'
              : '-translate-y-10 scale-0 opacity-0'
          }`}
        >
          <EditProductsJsx
            closeHandler={closeHandler}
            editHandler={editHandler}
            form={form}
            setForm={setForm}
            inputHandler={inputHandler}
            addPackagingMaterials={addPackagingMaterials}
            removePackagingMaterials={removePackagingMaterials}
            packagingHandler={packagingHandler}
          />
        </div>
      </div>
    </div>
  );
}

export default EditProducts;
