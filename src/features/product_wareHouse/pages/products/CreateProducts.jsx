import { lazy, useEffect, useMemo, useState } from 'react';

import { useGetProducts } from '../../Api/productsApi';
import { HashLoader } from 'react-spinners';
import { can, getPerm } from '../../../../utils/rbac';
import { useSelector } from 'react-redux';

import plus from '../../../../assets/images/plus.png';
import edit from '../../../../assets/images/edit.png';
import delet from '../../../../assets/images/delete.png';
import info from '../../../../assets/images/information.png';
import Form from '../../../../assets/images/form.png';
import {
  FaCheck,
  FaClipboardList,
  FaDownload,
  FaExclamationCircle,
  FaFilter,
} from 'react-icons/fa';
import { FiBell, FiCalendar } from 'react-icons/fi';
import { MdNoteAdd, MdNumbers } from 'react-icons/md';
import { FaXmark } from 'react-icons/fa6';
import { toast } from 'react-toastify';

const AddProducts = lazy(() => import('../../components/products/AddProducts'));
const DeleteProducts = lazy(
  () => import('../../components/products/DeleteProducts')
);
const EditProducts = lazy(
  () => import('../../components/products/EditProducts')
);
const FormProducts = lazy(
  () => import('../../components/products/FormProducts')
);
const DetailsProducts = lazy(
  () => import('../../components/products/DetailsProducts')
);
const TableProducts = lazy(
  () => import('../../components/products/TableProducts')
);
const Pagination = lazy(() => import('../../../../pagination/Pagination'));

function CreateProducts() {
  const { menus: userMenus } = useSelector((s) => s.auth);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [openFilterMobile, setOpenFilterMobile] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(null);

  // RBAC
  const perm = useMemo(
    () => getPerm(userMenus, 'definition-of-product'),
    [userMenus]
  );

  const canCreate = can(perm, 'create');
  const canEdit = can(perm, 'edit');
  const canDelete = can(perm, 'delete');

  const openCreate = () => {
    if (!canCreate) return toast.error('دسترسی ایجاد شناسنامه  ندارید');
    setOpenCreateModal(true);
  };

  const openEdit = (products) => {
    if (!canEdit) return toast.error('دسترسی ویرایش شناسنامه ندارید');

    setOpenEditModal(true);
    setSelectedProducts(products);
  };

  const askDelete = (p) => {
    if (!canDelete) return toast.error('دسترسی حذف شناسنامه ندارید');

    setOpenDeleteModal(true);
    setSelectedProducts(p);
  };

  const openInfo = (p) => {
    if (!canCreate)
      return toast.error('شما دسترسی دیدن جزئیات شناسنامه را ندارید');
    setOpenDetails(true);
    setSelectedProducts(p);
  };

  // Get Products
  const {
    data: products,
    isLoading,
    isError,
  } = useGetProducts({ page, pageSize, search });

  console.log(products);

  const totalPages = products?.totalPages ?? 1;

  const filteredData = products?.items;

  return (
    <div className="h-screen overflow-hidden rounded-[15px] bg-[#0F090C]/30 text-white">
      <div className="flex h-full flex-col overflow-hidden rounded-[15px] bg-black/70">
        {/* Header */}
        <div className="rounded-[10px] p-[5px] max-md:w-full">
          {/* Title & Deatails */}
          <div className="mx-2 mt-1 flex items-center justify-between border-b border-white/30 pb-3">
            {/* Title */}
            <div className="flex items-center space-x-5 text-white max-md:w-full max-md:justify-between">
              <p className="flex size-10 items-center justify-center rounded-[10px] bg-[#e54c00] max-md:hidden">
                <span className="text-[22px]">
                  <FaClipboardList />
                </span>
              </p>
              <p className="hidden w-16 opacity-0 max-md:block"></p>
              <p className="font-[SamimBold] text-[20px] max-md:flex max-md:items-center max-md:justify-center max-md:text-[12px]">
                شناسنامه محصولات
              </p>
              <p className="hidden max-md:block max-md:pt-1 max-md:pr-12 max-md:text-[20px]">
                <FiBell />
              </p>
            </div>
            {/* Details */}
            <div className="flex items-center space-x-5 pl-5 text-white max-md:hidden">
              <p className="flex space-x-1 text-[12px]">
                <span className="text-[17px] text-[#d84f15]">
                  <FiCalendar />
                </span>
                <span className="font-[SamimBold] text-[12px]">
                  تاریخ ویرایش :
                </span>
                <span className="font-[AvenirLTProMedium] text-[12px]">
                  1404/10/03
                </span>
              </p>
              <p className="space-x-1 text-[12px]">
                <span className="font-[SamimBold]">شماره ویرایش :</span>
                <span className="font-[AvenirLTProMedium]">01</span>
              </p>
              <p className="space-x-1 text-[12px]">
                <span className="font-[SamimBold]">کد سند :</span>
                <span className="font-[AvenirLTProMedium]">S0701</span>
              </p>
            </div>
          </div>
          {/* Add Reports & Excel */}
          <div className="mx-2 mt-1 flex items-center justify-between max-md:hidden">
            <div className="flex items-center pt-2 text-white">
              <button
                onClick={openCreate}
                className={`group flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-[Samim] ${
                  canCreate
                    ? 'cursor-pointer bg-white/10 hover:bg-white/15'
                    : 'cursor-not-allowed bg-white/5 opacity-50'
                }`}
              >
                <p className="relative cursor-pointer transition-all delay-150 duration-200 ease-in-out after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-white/50 after:transition-all after:duration-700 after:ease-out hover:scale-105 hover:after:w-full">
                  افزودن گزارش
                </p>
                <p className="text-[25px] text-[#d84f15] transition-all delay-150 duration-700 ease-in-out group-hover:rotate-360">
                  <MdNoteAdd />
                </p>
              </button>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2 pl-5 opacity-0">
              <button className="flex items-center justify-center rounded-[10px] bg-[#0e1117] px-4 py-2 text-[13px] text-white/70">
                <FaDownload />
                <span className="pr-2">خروجی اکسل</span>
              </button>
              <button className="flex items-center justify-center rounded-[10px] bg-[#f35714] px-4 py-2 text-[13px] text-white">
                <FaFilter />
                <span className="pr-2">فیلتر پیشرفته</span>
              </button>
            </div>
          </div>
        </div>
        {/* data reports */}
        <div className="mx-2 mt-1 flex items-center space-x-2 max-md:hidden">
          <div
            onClick={() => setFilterStatus('all')}
            className="col-span-1 flex w-80 cursor-pointer rounded-[10px] border border-[#be4615]/50 transition-all delay-100 duration-200 ease-in-out hover:scale-105"
          >
            <div className="my-auto p-5 text-[20px] max-lg:p-2 max-lg:text-[15px]">
              <p className="flex size-11 items-center justify-center rounded-[10px] bg-[#be4615]/25 text-[#be4615] max-lg:size-8">
                <MdNumbers />
              </p>
            </div>
            <p className="my-auto h-13 border-l-2 border-[#f35714]/70"></p>
            <div className="my-auto px-5">
              <p className="font-[AvenirLTProHeavy] text-[25px] font-extrabold text-white">
                {products?.totalCount}
              </p>
              <p className="text-white/60 max-2xl:text-[15px] max-lg:pb-2 max-lg:text-[10px]">
                کل شناسنامه ها
              </p>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center space-y-5">
            <HashLoader color="#ffffff" size={80} speedMultiplier={1.5} />
            <p className="pt-10 text-[20px]">لطفا منتظر بمانید😎</p>
          </div>
        ) : isError ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center space-y-5 text-[30px]">
            خطا در دریافت اطلاعات 😟
          </div>
        ) : (
          <div className="no-scrollbar 5xl:mt-5 flex min-h-0 w-full overflow-x-hidden overflow-y-auto">
            <div className="mx-3 w-full max-md:hidden">
              <TableProducts
                filteredData={filteredData}
                canEdit={canEdit}
                canDelete={canDelete}
                openEdit={openEdit}
                askDelete={askDelete}
                setOpenFormReport={setOpenForm}
                setSelectedProducts={setSelectedProducts}
              />
            </div>
          </div>
        )}
        <div
          className={`w-full shrink-0 ${filterStatus === 'confirmed' || filterStatus === 'pending' || filterStatus === 'pendingDesigner' || filterStatus === 'factoryManager' ? 'opacity-0' : ''}`}
        >
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </div>
      <AddProducts
        openCreateModal={openCreateModal}
        setOpenCreateModal={setOpenCreateModal}
      />

      <EditProducts
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
      />

      <DetailsProducts
        openDetails={openDetails}
        setOpenDetails={setOpenDetails}
        seledtedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
      />

      <FormProducts
        openForm={openForm}
        setOpenForm={setOpenForm}
        setSelectedProducts={setSelectedProducts}
        seledtedProducts={selectedProducts}
      />

      <DeleteProducts
        openDeleteProducts={openDeleteModal}
        setOpenDeleteProducts={setOpenDeleteModal}
        seledtedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
      />
    </div>
  );
}

export default CreateProducts;
