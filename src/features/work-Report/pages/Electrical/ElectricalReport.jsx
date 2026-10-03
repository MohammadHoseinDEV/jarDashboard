import { lazy, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  FaCheck,
  FaClipboardList,
  FaDownload,
  FaExclamationCircle,
  FaFilter,
} from 'react-icons/fa';
import { FiCalendar } from 'react-icons/fi';
import { FaXmark } from 'react-icons/fa6';
import { TbReport } from 'react-icons/tb';
import { MdNoteAdd, MdNumbers } from 'react-icons/md';
import { FiBell } from 'react-icons/fi';
import { FiSearch } from 'react-icons/fi';
import { MdEdit } from 'react-icons/md';
import { FiClock } from 'react-icons/fi';
import { toShamsi } from '../../../../Time/date';
import { can, getPerm } from '../../../../utils/rbac';
import { toast } from 'react-toastify';

import close from '../../../../assets/images/close.png';
import plus from '../../../../assets/images/plus.png';
import edit from '../../../../assets/images/edit.png';
import delet from '../../../../assets/images/delete.png';
import form from '../../../../assets/images/form.png';
import { HashLoader } from 'react-spinners';
import { HiHashtag } from 'react-icons/hi';
import { Tooltip } from 'react-tooltip';
import { FaBolt } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';

import { useGetProfile } from '../../../../hooks/profile/profile';
import {
  useGetElectericalReportAll,
  useGetElectricalReports,
} from '../../Api/Electrical/electrical';

const ElectricalFormReport = lazy(
  () => import('../../components/Electrical/ElectricalFormReport')
);
const ElectricalCreateReports = lazy(
  () => import('../../components/Electrical/ElectricalCreateReports')
);
const ElectricalEditReports = lazy(
  () => import('../../components/Electrical/ElectricalEditReports')
);
const ElectericalDeleteReports = lazy(
  () => import('../../components/Electrical/ElectericalDeleteReports')
);
import Pagination from '../../../../pagination/Pagination';
import { ReportActionElectrical } from '../../components/Electrical/ReportActionElectrical';
import FilterData from '../../components/Electrical/FilterData';

function ElectricalReport() {
  const { menus: userMenus } = useSelector((s) => s.auth);

  const [selectedElectrical, setSelectedElectrical] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [openFilterMobile, setOpenFilterMobile] = useState(false);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [shiftName, setShiftName] = useState('');
  const [shiftSupervisorName, setShiftSupervisorName] = useState('');
  const [personnelName, setPersonnelName] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [hasWorkTasks, setHasWorkTasks] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openFilter, setOpenFilter] = useState(false);

  const perm = useMemo(
    () => getPerm(userMenus, 'electrical-report'),
    [userMenus]
  );

  const canCreate = can(perm, 'create');
  const canEdit = can(perm, 'edit');
  const canDelete = can(perm, 'delete');

  const openCreate = (e = null) => {
    if (!canCreate) return toast.warning('دسترسی ایجاد گزارش ندارید');
    setOpenCreateModal(true);
    setSelectedElectrical(e);
  };

  const openEdit = (e) => {
    if (!canEdit) return toast.warning('دسترسی ویرایش گزارش ندارید');

    setOpenEditModal(true);
    setSelectedElectrical(e);
  };

  const askDelete = (e) => {
    if (!canDelete) return toast.warning('دسترسی حذف گزارش ندارید');

    setOpenDeleteModal(true);
    setSelectedElectrical(e);
  };

  const {
    data: electrical,
    isLoading,
    isError,
  } = useGetElectricalReports({
    search,
    startDate,
    endDate,
    shiftName,
    shiftSupervisorName,
    personnelName,
    dayOfWeek,
    hasWorkTasks,
    page,
    pageSize,
  });

  const { data: electericalAll } = useGetElectericalReportAll();

  const { data: profile } = useGetProfile();

  const isSuperAdmin = profile?.data?.identityRoles?.some(
    (p) => p.roleId === 'cfa79204-d797-4241-8630-55fcc1b2f721'
  );

  const isSupervisor = profile?.data?.companyRoles?.some(
    (p) => p.roleId === '5e6bcab8-bb18-482f-9805-477ac64fa209'
  );

  const totalPages = electrical?.data?.totalPages ?? 1;

  const allReport = electrical?.data?.totalCount;

  const allConfirmed = electericalAll?.data?.filter(
    (a) => a.isSupervisorSigned === true
  ).length;

  const allReject = electericalAll?.data?.filter(
    (a) =>
      a.isSupervisorSigned === false &&
      a.isShiftHandOverSigned === true &&
      a.isShiftReceiverSigned === true
  ).length;

  const allUnSign = electericalAll?.data?.filter(
    (a) =>
      a.isShiftHandOverSigned === false || a.isShiftReceiverSigned === false
  ).length;

  const filteredData = useMemo(() => {
    if (filterStatus === 'all') return electrical?.data?.items;

    return electericalAll?.data?.filter((e) => {
      if (filterStatus === 'confirmed') return e.isSupervisorSigned === true;
      if (filterStatus === 'pending')
        return (
          e.isSupervisorSigned === false &&
          e.isShiftHandOverSigned !== false &&
          e.isShiftReceiverSigned !== false
        );
      if (filterStatus === 'unSign')
        return (
          e.isShiftHandOverSigned === false || e.isShiftReceiverSigned === false
        );
      return true;
    });
  }, [filterStatus, electrical, electericalAll]);

  const countReport = electrical?.data?.items?.length;

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
              <p className="font-[SamimBold] text-[20px] max-md:flex max-md:items-center max-md:justify-center max-md:text-[15px]">
                گزارش روزانه واحد برق
              </p>
              <p className="hidden max-md:block max-md:pt-1 max-md:pr-12 max-md:text-[20px]">
                <FiBell />
              </p>
            </div>
            {/* Deatails */}
            <div className="flex items-center space-x-5 pl-5 text-white max-md:hidden">
              <p className="flex space-x-1 text-[12px]">
                <span className="text-[17px] text-[#d84f15]">
                  <FiCalendar />
                </span>
                <span className="font-[SamimBold] text-[12px]">
                  تاریخ ویرایش :
                </span>
                <span className="font-[AvenirLTProMedium] text-[12px]">
                  1403/06/03
                </span>
              </p>
              <p className="space-x-1 text-[12px]">
                <span className="font-[SamimBold]">شماره ویرایش :</span>
                <span className="font-[AvenirLTProMedium]">04</span>
              </p>
              <p className="space-x-1 text-[12px]">
                <span className="font-[SamimBold]">کد سند :</span>
                <span className="font-[AvenirLTProMedium]">F1101</span>
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
            <div className="flex items-center justify-end space-x-2 pt-2 pl-5">
              <button className="flex items-center justify-center rounded-[10px] bg-[#0e1117] px-4 py-2 text-[13px] text-white/70 opacity-0">
                <FaDownload />
                <span className="pr-2">خروجی اکسل</span>
              </button>
              <button
                onClick={() => {
                  setOpenFilter(true);
                }}
                className="flex cursor-pointer items-center justify-center rounded-[10px] bg-[#f35714] px-4 py-2 text-[13px] text-white"
              >
                <FaFilter />
                <span className="pr-2">فیلتر پیشرفته</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mx-2 mt-1 flex items-center justify-around space-x-2 max-md:hidden">
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
                {allReport}
              </p>
              <p className="text-white/60 max-2xl:text-[15px] max-lg:pb-2 max-lg:text-[10px]">
                کل گزارشات
              </p>
            </div>
          </div>
          <div
            onClick={() => setFilterStatus('confirmed')}
            className="flex w-80 cursor-pointer rounded-[10px] border border-[#a6e3a1]/50 transition-all delay-100 duration-200 ease-in-out hover:scale-105"
          >
            <div className="my-auto p-5 text-[20px] max-lg:p-2 max-lg:text-[15px]">
              <p className="flex size-11 items-center justify-center rounded-[10px] bg-[#1e2625]/25 text-[#a6e3a1] max-lg:size-8">
                <FaCheck />
              </p>
            </div>
            <p className="my-auto h-13 border-l-2 border-[#a6e3a1]"></p>
            <div className="my-auto px-5">
              <p className="font-[AvenirLTProHeavy] text-[25px] font-extrabold text-white">
                {allConfirmed}
              </p>
              <p className="text-white/60 max-2xl:text-[15px] max-lg:pb-2 max-lg:text-[10px]">
                گزارش های تایید شده
              </p>
            </div>
          </div>
          <div
            onClick={() => setFilterStatus('pending')}
            className="flex w-80 cursor-pointer rounded-[10px] border border-[#f10033]/50 transition-all delay-100 duration-200 ease-in-out hover:scale-105"
          >
            <div className="my-auto p-5 text-[20px] max-lg:p-2 max-lg:text-[15px]">
              <p className="flex size-11 items-center justify-center rounded-[10px] bg-[#262627]/25 text-[#f10033] max-lg:size-8">
                <FaXmark />
              </p>
            </div>
            <p className="my-auto h-13 border-l-2 border-[#f10033]"></p>
            <div className="my-auto px-5">
              <p className="font-[AvenirLTProHeavy] text-[25px] font-extrabold text-white">
                {allReject}
              </p>
              <p className="text-white/60 max-2xl:text-[14px] max-lg:pb-2 max-lg:text-[10px]">
                گزارش های تایید نشده
              </p>
            </div>
          </div>
          <div
            onClick={() => setFilterStatus('unSign')}
            className="flex w-80 cursor-pointer rounded-[10px] border border-white transition-all delay-100 duration-200 ease-in-out hover:scale-105"
          >
            <div className="my-auto p-5 text-[20px] max-lg:p-2 max-lg:text-[15px]">
              <p className="flex size-11 items-center justify-center rounded-[10px] bg-[#251d26]/25 text-white max-lg:size-8">
                <FaExclamationCircle />
              </p>
            </div>
            <p className="my-auto h-13 border-l-2 border-white"></p>
            <div className="my-auto px-5">
              <p className="font-[AvenirLTProHeavy] text-[25px] font-extrabold text-white">
                {allUnSign}
              </p>
              <p className="text-white/60 max-2xl:text-[14px] max-lg:pb-2 max-lg:text-[10px]">
                گزارش های بدون امضاء
              </p>
            </div>
          </div>
        </div>
        <div className="mx-2 mt-1 flex items-center justify-between max-md:hidden">
          <div className="col-span-4 flex items-center space-x-1 pr-5">
            <p className="text-[30px] text-[#e54c00]">
              <TbReport />
            </p>
            <p className="font-[SamimBold] text-[20px] text-white">
              لیست گزارشات
            </p>
          </div>
          <div className="col-span-2 flex items-center space-x-2 py-2">
            <div className="flex items-center space-x-2 rounded-[10px] border border-white/20 bg-[#07090f] px-2 text-white/50">
              <p
                onClick={() => setFilterStatus('all')}
                className={`my-1 cursor-pointer rounded-[10px] px-4 py-1 transition-all duration-200 ease-out ${
                  filterStatus === 'all'
                    ? 'scale-108 bg-[#f35714] text-white'
                    : 'scale-100 hover:text-white'
                } `}
              >
                همه
              </p>

              <p
                onClick={() => {
                  setFilterStatus('confirmed');
                }}
                className={`my-1 cursor-pointer rounded-[10px] px-4 py-1 transition-all duration-200 ease-out ${
                  filterStatus === 'confirmed'
                    ? 'scale-108 bg-[#f35714] text-white'
                    : 'scale-100 hover:text-white'
                } `}
              >
                امضاء شده
              </p>
              <p
                onClick={() => {
                  setFilterStatus('pending');
                }}
                className={`my-1 cursor-pointer rounded-[10px] px-4 py-1 transition-all duration-200 ease-out ${
                  filterStatus === 'pending'
                    ? 'scale-108 bg-[#f35714] text-white'
                    : 'scale-100 hover:text-white'
                } `}
              >
                درانتظار
              </p>
              <p
                onClick={() => {
                  setFilterStatus('unSign');
                }}
                className={`my-1 cursor-pointer rounded-[10px] px-4 py-1 transition-all duration-200 ease-out ${
                  filterStatus === 'unSign'
                    ? 'scale-108 bg-[#f35714] text-white'
                    : 'scale-100 hover:text-white'
                } `}
              >
                بدون امضاء
              </p>
            </div>
            <div>
              <input
                type="text"
                value={search}
                placeholder="جستجو..."
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                className="w-[30vh] rounded-[10px] border border-white/20 bg-[#07090f] py-2 placeholder:pr-2 placeholder:text-white/50"
              />
            </div>
          </div>
        </div>
        {/* Mobile */}
        <div className="mx-2 hidden max-md:block">
          <div className="my-3 rounded-[10px] border border-[#3a35a0] bg-linear-to-l from-[#201c66] to-[#1d1952] p-2">
            {/* Logo & Title Mobile */}
            <div className="flex items-center space-x-2">
              <p className="rounded-[10px] bg-[#4f46e5] p-2">
                <FaBolt />
              </p>
              <p className="text-[15px] font-bold">فرم گزارش روزانه واحد برق</p>
            </div>
            {/* Details Report */}
            <div className="mt-2 grid grid-cols-3 gap-3">
              <p className="flex flex-col items-center justify-center rounded-[10px] bg-[#343181] py-2">
                <span className="text-[11px] font-bold text-[#5e7ef8]">
                  کد سند
                </span>
                <span className="text-[] font-[AvenirLTProMedium]">F1101</span>
              </p>
              <p className="flex flex-col items-center justify-center rounded-[10px] bg-[#343181] py-2">
                <span className="text-[11px] font-bold text-[#5e7ef8]">
                  شماره ویرایش
                </span>
                <span className="font-[AvenirLTProMedium]">04</span>
              </p>
              <p className="flex flex-col items-center justify-center rounded-[10px] bg-[#343181] py-2">
                <span className="text-[11px] font-bold text-[#5e7ef8]">
                  تاریخ ویرایش
                </span>
                <span className="font-[AvenirLTProMedium]">1403/06/03</span>
              </p>
            </div>
          </div>
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              value={search}
              placeholder="جستجو در گزارش ها ..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              className="mb-3 h-11 w-full rounded-[10px] border border-[#2c3050] bg-[#22263a] pr-8 font-bold"
            />
            <p className="absolute top-3 right-2 text-white/50">
              <FiSearch />
            </p>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center space-x-1 text-[#6b75a0]">
              <p className="font-[AvenirLTProMedium]">
                {filterStatus === 'all' && countReport}
                {filterStatus === 'confirmed' && allConfirmed}
                {filterStatus === 'pending' && allReject}
                {filterStatus === 'unSign' && allUnSign}
              </p>
              <p className="font-semibold">گزارش یافت شد</p>
            </div>
            <div
              onClick={() => {
                setOpenFilterMobile(!openFilterMobile);
              }}
              className="relative pl-2 text-[#6b75a0]"
            >
              <p>فیلتر</p>

              {openFilterMobile && (
                <div className="absolute top-1 left-11 flex h-40 w-45 flex-col justify-center space-y-2 rounded-[10px] border border-[#3a35a0] bg-linear-to-l from-[#201c66] to-[#1d1952] pr-1">
                  <p
                    onClick={() => {
                      setFilterStatus('all');
                    }}
                    className={`ml-1 rounded-[10px] ${filterStatus === 'all' ? 'bg-gray-200/10 p-1.5 text-white ' : ''}`}
                  >
                    کل گزارشات
                  </p>
                  <p
                    onClick={() => setFilterStatus('confirmed')}
                    className={`ml-1 rounded-[10px] ${filterStatus === 'confirmed' ? 'bg-gray-200/10 p-1.5 text-white ' : ''}`}
                  >
                    گزارشات امضاء شده
                  </p>
                  <p
                    onClick={() => setFilterStatus('pending')}
                    className={`ml-1 rounded-[10px] ${filterStatus === 'pending' ? 'bg-gray-200/10 p-1.5 text-white ' : ''}`}
                  >
                    گزارشات تایید نشده
                  </p>
                  <p
                    onClick={() => setFilterStatus('unSign')}
                    className={`ml-1 rounded-[10px] ${filterStatus === 'unSign' ? 'bg-gray-200/10 p-1.5 text-white ' : ''}`}
                  >
                    گزارشات بدون امضاء
                  </p>
                </div>
              )}
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
          <div className="no-scrollbar flex min-h-0 w-full overflow-x-hidden overflow-y-auto">
            <table className="mx-2 w-full border-separate border-spacing-y-0 max-md:hidden">
              <thead className="bg-[#0b0c12] text-white/70">
                <tr>
                  <th className="rounded-tr-[10px] border-t border-r border-b border-white/30 py-3 pr-5">
                    ردیف
                  </th>
                  <th className="border-t border-b border-white/30">
                    نام و نام خانوادگی
                  </th>
                  <th className="w-40 border-t border-b border-white/30">
                    شماره گزارش
                  </th>
                  <th className="border-t border-b border-white/30">
                    تاریخ ثبت گزارش
                  </th>
                  <th className="border-t border-b border-white/30">
                    تاریخ ویرایش
                  </th>
                  <th className="border-t border-b border-white/30">
                    تاریخ امضاء سرپرست
                  </th>
                  <th className="w-25 border-t border-b border-white/30">
                    وضعیت
                  </th>
                  <th className="rounded-tl-[10px] border-t border-b border-l border-white/30">
                    عملیات
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData?.map((e, index) => (
                  <tr key={e.id} className="text-center">
                    <td className="size-5 border-b border-white/20">
                      <p className="my-3 mr-5 rounded-[10px] border border-white/10 bg-[#131720] py-1 font-[AvenirLTProMedium] text-white/70">
                        {index + 1}
                      </p>
                    </td>
                    <td className="border-b border-white/20 font-[VazirLight] text-white">
                      {e?.personnelName}
                    </td>
                    <td className="border-b border-white/20">
                      <p className="rounded-[10px] border border-[#32a3de]/40 bg-[#182228] font-[AvenirLTProBook] text-[#32a3de]">
                        {e?.reportNumber}
                      </p>
                    </td>
                    <td className="flex items-center justify-center border-b border-white/20 py-5 font-[AvenirLTProBook] text-white">
                      <p className="pl-2 text-[20px] text-[#863515]">
                        <FiCalendar />
                      </p>

                      {toShamsi(e?.createdAt)}
                    </td>
                    <td className="border-b border-white/20">
                      <div className="flex items-center justify-center space-x-2">
                        <p className="text-[20px] text-[#863515]">
                          <FiCalendar />
                        </p>
                        <p className="font-[AvenirLTProBook] text-white">
                          {toShamsi(e?.updatedAt)}
                        </p>
                      </div>
                    </td>
                    <td className="border-b border-white/20">
                      <div className="flex items-center justify-center space-x-2">
                        <p className="text-[20px] text-[#863515]">
                          <FiCalendar />
                        </p>
                        <p className="font-[AvenirLTProBook] text-white">
                          {toShamsi(e?.supervisorSignedAt)}
                        </p>
                      </div>
                    </td>
                    <td className="border-b border-white/20">
                      {(() => {
                        if (e?.isSupervisorSigned === true) {
                          return (
                            <p className="rounded-[10px] bg-[#1b4025]/50 py-1 text-[#3cbb30]">
                              تکمیل شده
                            </p>
                          );
                        }
                        if (e?.isShiftHandOverSigned === false) {
                          return (
                            <p className="rounded-[10px] bg-[#f30437]/70 py-1 text-white">
                              بدون امضاء
                            </p>
                          );
                        }
                        if (e?.isSupervisorSigned === false) {
                          return (
                            <p className="rounded-[10px] bg-[#262627]/70 py-1 text-[#f9e2af]">
                              در انتظار
                            </p>
                          );
                        }
                      })()}
                    </td>
                    <td className="border-b border-white/20">
                      <ReportActionElectrical
                        report={e}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        openEdit={openEdit}
                        askDelete={askDelete}
                        setOpenFormReport={setOpenForm}
                        setSelectedReport={setSelectedElectrical}
                        profile={profile}
                        isSuperAdmin={isSuperAdmin}
                        isSupervisor={isSupervisor}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Mobile Table */}
            <div className="hidden w-full max-md:block">
              {filteredData?.map((e, index) => (
                <div
                  key={e.id}
                  className="mx-2 my-2 rounded-[10px] border border-white/30"
                >
                  <div className="mx-1 my-2 flex items-center justify-between border-b border-white/50 px-2 pb-2">
                    <div className="flex items-center space-x-3">
                      <p className="rounded-full bg-[#252d5a] p-4 text-white/50">
                        <FiUser />
                      </p>
                      <p className="flex flex-col space-y-0.5">
                        <span className="font-bold">{e?.personnelName}</span>
                        <span className="font-[AvenirLTProMedium] text-[13px] text-white/60">
                          {e?.reportNumber}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center">
                      {(() => {
                        if (e?.isSupervisorSigned === true) {
                          return (
                            <p className="rounded-[10px] bg-[#1b4025]/50 px-1 py-1 text-[#3cbb30]">
                              تکمیل شده
                            </p>
                          );
                        }
                        if (e?.isShiftHandOverSigned === false) {
                          return (
                            <p className="rounded-[10px] bg-[#f30437]/70 px-1 py-1 text-white">
                              بدون امضاء
                            </p>
                          );
                        }
                        if (e?.isSupervisorSigned === false) {
                          return (
                            <p className="rounded-[10px] bg-[#262627]/70 px-1 py-1 text-[#f9e2af]">
                              در انتظار
                            </p>
                          );
                        }
                      })()}
                    </div>
                  </div>
                  <div className="mx-1 mb-2 grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <p className="text-[22px] text-white/50">
                        <FiCalendar />
                      </p>
                      <p className="flex flex-col">
                        <span className="text-white/50">تاریخ ثبت</span>
                        <span className="font-[AvenirLTProMedium]">
                          {toShamsi(e?.createdAt)}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-[22px] text-white/50">
                        <MdEdit />
                      </p>
                      <p className="flex flex-col">
                        <span className="text-white/50">تاریخ ویرایش</span>
                        <span className="font-[AvenirLTProMedium]">
                          {toShamsi(e?.updatedAt)}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-[22px] text-white/50">
                        <FiClock />
                      </p>
                      <p className="flex flex-col">
                        <span className="text-white/50">امضاء سرپرست</span>
                        <span className="font-[AvenirLTProMedium]">
                          {toShamsi(e?.supervisorSignedAt)}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <p className="text-[22px] text-white/50">
                        <HiHashtag />
                      </p>
                      <p className="flex flex-col">
                        <span className="text-white/50">شماره گزارش</span>
                        <span className="font-[AvenirLTProMedium]">
                          {e?.reportNumber}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="mx-2 grid grid-cols-7 gap-2">
                    <button
                      onClick={() => openEdit(e)}
                      className={`col-span-3 mb-2 flex cursor-pointer items-center justify-center rounded-[10px] p-1 font-[Samim] ${
                        (canEdit &&
                          profile?.data?.id === e?.createdBy &&
                          e?.isSupervisorSigned === false) ||
                        (canEdit && isSupervisor) ||
                        isSuperAdmin
                          ? 'cursor-pointer bg-linear-to-bl from-green-500/10 to-green-800/50 transition-all delay-100 duration-150 ease-in-out hover:scale-106'
                          : 'hidden bg-white/5 opacity-50'
                      }`}
                    >
                      <img
                        src={edit}
                        alt="edit"
                        width={20}
                        className="mx-3 py-1"
                      />
                      <span className="pl-4">ویرایش</span>
                    </button>
                    <button
                      onClick={() => {
                        setOpenForm(true);
                        setSelectedElectrical(e);
                      }}
                      className="col-span-3 mb-2 flex cursor-pointer items-center justify-center rounded-[10px] bg-linear-to-bl from-white/30 to-white/70 p-1 px-7 font-[Samim] transition-all delay-100 duration-150 ease-in-out hover:scale-106"
                    >
                      <img src={form} alt="" width={20} className="mx-3 py-1" />
                      مشاهده
                    </button>
                    <button
                      onClick={() => askDelete(e)}
                      className={`mb-2 flex cursor-pointer items-center justify-center rounded-[10px] p-2 font-[Samim] ${
                        canDelete
                          ? 'cursor-pointer bg-linear-to-bl from-red-500/10 to-red-800/50 transition-all delay-100 duration-150 ease-in-out hover:scale-106'
                          : 'hidden bg-white/5 opacity-50'
                      }`}
                    >
                      <img src={delet} alt="" width={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          className={`shrink-0 ${filterStatus === 'confirmed' || filterStatus === 'pending' || filterStatus === 'unSign' ? 'opacity-0' : ''}`}
        >
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      </div>
      <ElectricalCreateReports
        openCreateModal={openCreateModal}
        setOpenCreateModal={setOpenCreateModal}
      />
      <ElectricalEditReports
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        selectedElectrical={selectedElectrical}
        setSelectedElectrical={setSelectedElectrical}
      />
      <ElectericalDeleteReports
        openDeleteModal={openDeleteModal}
        setOpenDeleteModal={setOpenDeleteModal}
        selectedElectrical={selectedElectrical}
      />
      <ElectricalFormReport
        openForm={openForm}
        setOpenForm={setOpenForm}
        selectedElectrical={selectedElectrical}
        setSelectedElectrical={setSelectedElectrical}
        electrical={electrical}
      />
      <FilterData openFilter={openFilter} setOpenFilter={setOpenFilter} />
    </div>
  );
}

export default ElectricalReport;
