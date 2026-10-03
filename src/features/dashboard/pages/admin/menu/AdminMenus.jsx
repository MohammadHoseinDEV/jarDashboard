import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';

import edit from '../../../../../assets/images/edit.png';
import delet from '../../../../../assets/images/delete.png';
import plus from '../../../../../assets/images/plus.png';
import close from '../../../../../assets/images/close.png';

import { toast } from 'react-toastify';
import axios from 'axios';
import Pagination from '../../../../../pagination/Pagination';

import { MENU_ICON_MAP, MENU_ICON_OPTIONS } from '../../../../../icons/icons';
import { HashLoader } from 'react-spinners';
import API_HOST from '../../../../../../API/api';
import { useGetMenu } from '../../../../../hooks/menu/menuApi';

function AdminMenus() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [mobile, setMobile] = useState(false);

  const queryClient = useQueryClient();
  const { token, menus: userMenus } = useSelector((state) => state.auth);

  const myPermission = useMemo(() => {
    const list = userMenus || [];
    return list.find((m) => m?.url === 'admin-menus');
  }, [userMenus]);

  const canCreate = myPermission?.canCreate ?? false;
  const canEdit = myPermission?.canEdit ?? false;
  const canDelete = myPermission?.canDelete ?? false;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [query, setQuery] = useState('');
  const [searchMenu, setSearchMenu] = useState('');

  const [form, setForm] = useState({
    name: '',
    title: '',
    url: '',
    icon: '',
    displayOrder: 1,
    parentMenuId: '',
    isActive: true,
  });

  const { data, isLoading, isError } = useGetMenu({ page, pageSize, search });

  const flatList = useMemo(() => {
    const flatten = (list) =>
      (list || []).flatMap((menu) => [menu, ...flatten(menu.subMenus)]);

    return flatten(data?.menus);
  }, [data]);

  const parentOptions = useMemo(() => {
    return flatList.map((m) => ({
      id: m.id,
      title: m.title,
      name: m.name,
      isActive: m.isActive,
    }));
  }, [flatList]);
  console.log(parentOptions);

  const resetForm = () => {
    setEditing(null);
    setForm({
      name: '',
      title: '',
      url: '',
      icon: '',
      displayOrder: 1,
      parentMenuId: '',
      isActive: true,
    });
  };

  const openCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (menu) => {
    setEditing(menu);
    setForm({
      name: menu?.name || '',
      title: menu?.title || '',
      url: menu?.url || '',
      icon: menu?.icon || '',
      displayOrder: menu?.displayOrder ?? 1,
      parentMenuId: menu?.parentMenuId || '',
      isActive: menu?.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const validate = () => {
    if (!form.name.trim()) return 'name الزامی است';
    if (!form.title.trim()) return 'title الزامی است';
    return null;
  };

  const createMenu = async () => {
    if (!canCreate) return toast.error('شما دسترسی ایجاد ندارید');

    const msg = validate();
    if (msg) return toast.error(msg);

    const dto = {
      name: form.name.trim(),
      title: form.title.trim(),
      url: form.url.trim().replace(/^\//, ''),
      icon: form.icon.trim() || null,
      displayOrder: Number(form.displayOrder) || 1,
      parentMenuId: form.parentMenuId ? form.parentMenuId : null,
      isActive: !!form.isActive,
    };

    try {
      await axios.post(`${API_HOST}:5257/api/MyMenu`, dto, { headers });
      toast.success('منو ساخته شد');
      closeModal();
      refetch();
    } catch (e) {
      toast.error(
        e?.response?.data?.title ||
          e?.response?.data?.message ||
          'خطا در ساخت منو'
      );
    }
  };

  const updateMenu = async () => {
    if (!canEdit) return toast.error('شما دسترسی ویرایش ندارید');
    if (!editing?.id) return;

    const msg = validate();
    if (msg) return toast.error(msg);

    const dto = {
      name: form.name.trim(),
      title: form.title.trim(),
      url: form.url.trim().replace(/^\//, ''),
      icon: form.icon.trim() || null,
      displayOrder: Number(form.displayOrder) || 1,
      parentMenuId: form.parentMenuId ? form.parentMenuId : null,
      isActive: !!form.isActive,
    };

    try {
      await axios.put(
        `${API_HOST}:5257/api/MyMenu/UpdateMenu/${editing.id}`,
        dto,
        {
          headers,
        }
      );
      toast.success('منو ویرایش شد');
      closeModal();
      refetch();
    } catch (e) {
      toast.error(
        e?.response?.data?.title ||
          e?.response?.data?.message ||
          'خطا در ویرایش منو'
      );
    }
  };

  const askDelete = (menu) => {
    setDeleteTarget(menu);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!canDelete) return toast.error('شما دسترسی حذف ندارید');
    if (!deleteTarget?.id) return;

    try {
      await axios.delete(
        `${API_HOST}:5257/api/MyMenu/DeleteMenu/${deleteTarget.id}`,
        {
          headers,
        }
      );
      toast.success('منو حذف شد');
      closeDeleteModal();
      refetch();
    } catch (e) {
      toast.error(
        e?.response?.data?.title ||
          e?.response?.data?.message ||
          'خطا در حذف منو'
      );
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const iconList = [{ key: '', lable: 'بدون آیکن' }, ...MENU_ICON_OPTIONS];

  const filteredIcons =
    query.trim() === ''
      ? iconList
      : iconList.filter((icon) =>
          icon?.label?.toLowerCase().includes(query.toLowerCase())
        );

  const selectedIcon =
    iconList.find((item) => item.key === form.icon) || iconList[0];

  // ---------------------------------

  const parentMenu = useMemo(() => {
    const none = { id: '', title: 'بدون والد', isActive: true };

    return [
      none,
      ...parentOptions.map((p) => ({
        id: p.id,
        title: p.title || p.name || '--',
        isActive: p.isActive,
      })),
    ];
  }, [parentOptions]);

  const filterdMenu = useMemo(() => {
    return searchMenu.trim() === ''
      ? parentMenu
      : parentMenu.filter((m) =>
          (m?.title || '').toLowerCase().includes(searchMenu.toLowerCase())
        );
  }, [parentMenu, searchMenu]);

  const selectedMenu = useMemo(() => {
    return (
      parentMenu.find((m) => m.id === (form.parentMenuId || '')) ||
      parentMenu[0]
    );
  }, [parentMenu, form.parentMenuId]);
  // --------------------------------------------

  return (
    <div className="rounded-[15px] bg-[#0F090C]/30 p-6 text-white">
      {/* table */}
      <div>
        {mobile ? (
          <div>
            <div className="overflow-hidden">
              <h1 className="pb-2 text-center font-[SamimBold] text-[30px]">
                مدیریت منو
              </h1>

              <p className="flex flex-col">
                <input
                  type="text"
                  placeholder="جستجو..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full rounded-xl bg-white/10 p-3 font-[SamimBold] text-white outline-none placeholder:text-white focus:bg-white/70 focus:text-black focus:placeholder:text-black"
                />
                <button
                  disabled={!canCreate}
                  onClick={openCreate}
                  className={`mt-5 flex items-center justify-center rounded-xl px-4 py-2 font-[Samim] ${
                    canCreate
                      ? 'bg-white/10 hover:bg-white/15'
                      : 'bg-white/5 opacity-50'
                  }`}
                >
                  افزودن منو +
                </button>
              </p>
            </div>

            {/*  mobile */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-5 py-35">
                <HashLoader color="#ffffff" size={80} speedMultiplier={1.5} />
                <p className="pt-8 text-[20px]">لطفا منتظر بمانید😎</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center space-y-5 py-50 text-[25px]">
                خطا در دریافت اطلاعات 😟
              </div>
            ) : (
              <div className="no-scrollbar max-h-100 overflow-y-auto">
                {data?.menus?.map((menu) => (
                  <div key={menu.id}>
                    <React.Fragment>
                      <div className="mt-3 h-fit rounded-2xl border border-white/50 bg-black/35 pt-2 pb-2">
                        <div className="rounded-2xl pr-2">
                          <p className="space-x-1 pt-3 text-[20px]">
                            <span className="font-[SamimBold]">عنوان:</span>
                            <span className="font-[VazirLight]">
                              {menu.title}
                            </span>
                          </p>
                          <p className="space-x-1 pt-3 text-[20px]">
                            <span className="font-[SamimBold]">نام:</span>
                            <span>{menu.name}</span>
                          </p>

                          <p className="space-x-1 pt-2 text-[20px]">
                            <span className="font-[SamimBold]">{menu.url}</span>
                            <span> :URL</span>
                          </p>
                          <p className="space-x-1 pt-2 text-[20px]">
                            <span className="font-[SamimBold]">ترتیب:</span>
                            <span>{menu.displayOrder}</span>
                          </p>
                          <p className="space-x-1 pt-2 pb-2 text-[20px]">
                            <span className="font-[SamimBold]">وضعیت:</span>
                            <span>{menu.isActive ? 'فعال' : 'غیرفعال'}</span>
                          </p>
                        </div>
                        <div className="flex items-center justify-center">
                          <p className="space-x-2 pt-2">
                            <button
                              disabled={!canEdit}
                              onClick={() => openEdit(menu)}
                              className={`mb-2 cursor-pointer rounded-[10px] bg-white/30 px-3 py-2 font-[Samim] max-sm:text-[9px] ${
                                canEdit
                                  ? 'bg-white/10 hover:bg-white/15'
                                  : 'bg-white/5 opacity-50'
                              }`}
                            >
                              <img src={edit} alt="edit" width={25} />
                            </button>
                            <button
                              disabled={!canDelete}
                              onClick={() => askDelete(menu)}
                              className={`mb-2 cursor-pointer rounded-[10px] bg-white/30 px-3 py-2 font-[Samim] max-sm:text-[9px] ${
                                canDelete
                                  ? 'bg-white/10 hover:bg-red-500/30'
                                  : 'bg-white/5 opacity-50'
                              }`}
                            >
                              <img src={delet} alt="delete" width={25} />
                            </button>
                          </p>
                        </div>
                      </div>
                      {/* submenus */}
                      <div>
                        {menu?.subMenus?.map((menu) => (
                          <div key={menu.id} className="mt-3 flex rounded-2xl">
                            <p className="mt-2 ml-2">↳</p>
                            <div className="flex w-full flex-col rounded-2xl border border-white/50 bg-black/40">
                              <div className="mb-2 flex flex-col rounded-2xl pr-2 pb-1">
                                <p className="space-x-1 pt-3 text-[20px]">
                                  <span className="font-[SamimBold]">
                                    عنوان:
                                  </span>
                                  <span className="font-[VazirLight]">
                                    {menu.title}
                                  </span>
                                </p>
                                <p className="space-x-1 pt-3 text-[20px]">
                                  <span className="font-[VazirLight]">
                                    نام:
                                  </span>
                                  <span> {menu.name}</span>
                                </p>
                                <p className="space-x-1 pt-3 text-[20px]">
                                  <span>{menu.url}</span>
                                  <span className="font-[VazirLight]">
                                    :URL
                                  </span>
                                </p>
                                <p className="space-x-1 pt-3 text-[20px]">
                                  <span className="font-[VazirLight]">
                                    ترتیب:
                                  </span>
                                  <span>{menu.displayOrder}</span>
                                </p>
                                <p className="space-x-1 pt-3 pb-2 text-[20px]">
                                  <span className="font-[SamimBold]">
                                    وضعیت:
                                  </span>
                                  <span className="font-[VazirLight]">
                                    {menu.isActive ? 'فعال' : 'غیرفعال'}
                                  </span>
                                </p>
                              </div>
                              <div className="flex items-center justify-center">
                                <p className="space-x-2 pt-2">
                                  <button
                                    disabled={!canEdit}
                                    onClick={() => openEdit(menu)}
                                    className={`mb-2 cursor-pointer rounded-[10px] bg-white/30 px-3 py-2 font-[Samim] ${
                                      canEdit
                                        ? 'cursor-pointer bg-white/10 hover:bg-white/15'
                                        : 'cursor-not-allowed bg-white/5 opacity-50'
                                    }`}
                                  >
                                    <img src={edit} alt="edit" width={25} />
                                  </button>
                                  <button
                                    disabled={!canDelete}
                                    onClick={() => askDelete(menu)}
                                    className={`mb-2 cursor-pointer rounded-[10px] bg-white/30 px-3 py-2 font-[Samim] ${
                                      canDelete
                                        ? 'cursor-pointer bg-white/10 hover:bg-red-500/30'
                                        : 'cursor-not-allowed bg-white/5 opacity-50'
                                    }`}
                                  >
                                    <img src={delet} alt="delete" width={25} />
                                  </button>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </React.Fragment>
                  </div>
                ))}
                <Pagination
                  page={page}
                  setPage={setPage}
                  totalPages={data?.totalPages || 1}
                />
              </div>
            )}
          </div>
        ) : (
          <>
            {/* search div & desktop */}

            <div className="rounded-[15px] bg-[#0F090C]/40 p-6 text-white">
              <div className="flex w-full items-center justify-between rounded-2xl border border-white/70 bg-[#0F090c]/30 p-4 transition-all delay-200 duration-200 ease-in-out hover:scale-101">
                <input
                  type="text"
                  placeholder="جستجو..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-[300px] rounded-xl bg-white/10 p-3 font-[SamimBold] text-white outline-none placeholder:text-white focus:bg-white/70 focus:text-black focus:placeholder:text-black"
                />
                <h1 className="flex items-center justify-center font-[SamimBold] text-xl">
                  مدیریت منو
                </h1>

                <button
                  disabled={!canCreate}
                  onClick={openCreate}
                  className={`group flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-[Samim] ${
                    canCreate
                      ? 'cursor-pointer bg-white/10 hover:bg-white/15'
                      : 'cursor-not-allowed bg-white/5 opacity-50'
                  }`}
                >
                  <span className="relative cursor-pointer transition-all delay-150 duration-200 ease-in-out after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-white/50 after:transition-all after:duration-700 after:ease-out hover:scale-105 hover:after:w-full">
                    افزودن منو جدید
                  </span>
                  <span className="transition-all delay-150 duration-700 ease-in-out group-hover:rotate-360">
                    <img src={plus} alt="plus" width={30} />
                  </span>
                </button>
              </div>

              {/* table  */}
              <div>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-5 py-50">
                    <HashLoader
                      color="#ffffff"
                      size={80}
                      speedMultiplier={1.5}
                    />
                    <p className="pt-8 text-[20px]">لطفا منتظر بمانید😎</p>
                  </div>
                ) : isError ? (
                  <div className="flex flex-col items-center justify-center space-y-5 py-50 text-[25px]">
                    خطا در دریافت اطلاعات 😟
                  </div>
                ) : (
                  <>
                    <div className="mt-5 rounded-2xl border border-white/50">
                      <div className="no-scrollbar max-h-[550px] overflow-auto">
                        <table className="w-full border-separate border-spacing-y-2 px-5">
                          <thead>
                            <tr className="text-center text-white/70">
                              <th className="px-3 font-[SamimBold] text-[20px]">
                                عنوان
                              </th>
                              <th className="px-3 font-[SamimBold]">نام</th>
                              <th className="px-3">لینک صفحه</th>
                              <th className="px-3">المان</th>
                              <th className="px-3">ترتیب</th>
                              <th className="px-3">فعال</th>
                              <th className="px-3">عملیات</th>
                            </tr>
                          </thead>

                          <tbody className="max-sm:grid max-sm:grid-cols-1">
                            {flatList?.map((m) => (
                              <tr
                                key={m.id}
                                className="rounded-xl bg-white/5 text-center"
                              >
                                <td className="px-3 py-3 font-[Samim]">
                                  <span
                                    style={{
                                      paddingRight: m.__level * 18,
                                      display: 'inline-block',
                                    }}
                                  >
                                    {m.__level > 0 ? '↳ ' : ''}
                                    {m.title}
                                  </span>
                                </td>
                                <td className="px-3 py-3 font-[Samim] text-white/80">
                                  {m.name}
                                </td>
                                <td className="px-3 py-3 font-[Samim] text-white/80">
                                  {m.url ?? (
                                    <span className="text-white/40">—</span>
                                  )}
                                </td>
                                <td className="px-3 py-3 font-[Samim] text-white/80">
                                  {MENU_ICON_MAP[m.icon] ? (
                                    typeof MENU_ICON_MAP[m.icon] ===
                                    'function' ? (
                                      // آیکون React
                                      <span className="mx-auto flex justify-center text-xl text-white/80">
                                        {React.createElement(
                                          MENU_ICON_MAP[m.icon]
                                        )}
                                      </span>
                                    ) : (
                                      // آیکون عکس
                                      <img
                                        src={MENU_ICON_MAP[m.icon]}
                                        alt={m.icon}
                                        className="mx-auto h-6 w-6 object-contain"
                                      />
                                    )
                                  ) : (
                                    <span className="text-white/50">
                                      {m.icon ?? '--'}
                                    </span>
                                  )}
                                </td>

                                <td className="px-3 py-3 font-[AvenirLTProMedium] text-white/80">
                                  {m.displayOrder}
                                </td>
                                <td className="px-3 py-3 font-[Samim] text-white/80">
                                  {m.isActive ? 'فعال' : 'غیر فعال'}
                                </td>
                                <td className="px-3 py-3">
                                  <div className="flex justify-center gap-2">
                                    <button
                                      disabled={!canEdit}
                                      onClick={() => openEdit(m)}
                                      className={`cursor-pointer rounded-[10px] p-2 font-[Samim] ${
                                        canEdit
                                          ? 'cursor-pointer bg-linear-to-bl from-green-500/10 to-green-800/50 transition-all delay-100 duration-150 ease-in-out hover:scale-106'
                                          : 'cursor-not-allowed bg-white/5 opacity-50'
                                      }`}
                                    >
                                      <img src={edit} alt="edit" width={20} />
                                    </button>

                                    <button
                                      disabled={!canDelete}
                                      onClick={() => askDelete(m)}
                                      className={`rounded-[10px] p-2 font-[Samim] ${
                                        canDelete
                                          ? 'cursor-pointer bg-linear-to-bl from-red-500/10 to-red-800/50 transition-all delay-100 duration-150 ease-in-out hover:scale-106'
                                          : 'cursor-not-allowed bg-white/5 opacity-50'
                                      }`}
                                    >
                                      <img
                                        src={delet}
                                        alt="delete"
                                        width={20}
                                      />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <Pagination
                      page={page}
                      setPage={setPage}
                      totalPages={data?.totalPages || 1}
                    />
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal Create/Edit */}

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
          isModalOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

        <div
          className={`relative w-[450px] transform rounded-[15px] bg-linear-to-tl from-black to-gray-600 p-6 text-white shadow-2xl transition-all duration-300 ${
            isModalOpen
              ? 'translate-y-0 scale-100 opacity-100'
              : '-translate-y-10 scale-95 opacity-0'
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-[SamimBold] text-lg">
              {editing ? 'ویرایش منو' : 'افزودن منو'}
            </h2>
            <button
              onClick={() => {
                setIsModalOpen(false);
              }}
              className="cursor-pointer rounded-[10px] bg-white/80 p-1.5 text-[30px] text-red-500 transition-all delay-100 duration-75 ease-in-out hover:bg-black"
            >
              <img
                src={close}
                alt="close"
                width={20}
                className="transition-all delay-100 duration-100 ease-in-out hover:scale-110"
              />
            </button>
          </div>
          <div className="mt-4 grid gap-3">
            <input
              className="w-full rounded-xl bg-white/10 p-3 font-[Samim] text-white outline-none"
              placeholder="name (مثلاً admin-roles)"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            <input
              className="w-full rounded-xl bg-white/10 p-3 font-[Samim] text-white outline-none"
              placeholder="title (مثلاً مدیریت نقش‌ها)"
              value={form.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
            <input
              className="w-full rounded-xl bg-white/10 p-3 font-[Samim] text-white outline-none"
              placeholder="url (مثلاً admin-roles)"
              value={form.url}
              onChange={(e) => handleChange('url', e.target.value)}
            />

            <Combobox
              value={selectedIcon}
              onChange={(value) => handleChange('icon', value?.key || '')}
            >
              {({ open }) => (
                <div className="relative">
                  <Combobox.Button className="flex w-full items-center justify-between rounded-xl bg-white/10 p-3 font-[Samim] text-white outline-none">
                    <span
                      className={
                        selectedIcon?.key ? 'text-white' : 'text-white/70'
                      }
                    >
                      {selectedIcon?.label || 'انتخاب آیکن...'}
                    </span>
                    <span className="text-white/70">{open ? '▴' : '▾'}</span>
                  </Combobox.Button>

                  {/* Dropdown */}
                  <div
                    className={`absolute z-50 mt-2 w-full overflow-auto rounded-xl bg-black/95 shadow-lg ring-1 ring-white/10 ${
                      open ? '' : 'hidden '
                    }`}
                  >
                    <div className="border-b border-white/10 p-2">
                      <Combobox.Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="جستجو..."
                        className="w-full rounded-lg bg-white/10 p-2 font-[Samim] text-white outline-none placeholder:text-white/50"
                      />
                    </div>

                    {/* لیست */}
                    <ComboboxOptions className="no-scrollbar max-h-60 overflow-auto p-1">
                      {filteredIcons.length === 0 ? (
                        <div className="p-3 text-white/70">موردی پیدا نشد</div>
                      ) : (
                        filteredIcons.map((icon) => (
                          <ComboboxOption
                            key={icon.key || 'none'}
                            value={icon}
                            className={({ active, selected }) =>
                              `cursor-pointer rounded-lg p-3 text-white ${
                                active ? 'bg-black' : ''
                              } ${selected ? 'bg-black' : ''}`
                            }
                          >
                            {icon.label}
                          </ComboboxOption>
                        ))
                      )}
                    </ComboboxOptions>
                  </div>
                </div>
              )}
            </Combobox>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                className="w-full rounded-xl bg-white/10 p-3 font-[Samim] text-white outline-none"
                placeholder="displayOrder"
                value={form.displayOrder}
                onChange={(e) => handleChange('displayOrder', e.target.value)}
              />

              <Combobox
                value={selectedMenu}
                onChange={(value) =>
                  handleChange('parentMenuId', value?.id || '')
                }
              >
                {({ open }) => (
                  <div className="relative">
                    <Combobox.Button className="flex w-full items-center justify-between rounded-xl bg-white/10 p-3 font-[Samim] text-white outline-none">
                      <span
                        className={
                          selectedMenu?.id ? 'text-white' : 'text-white/70'
                        }
                      >
                        {selectedMenu?.title || 'انتخاب آیکن...'}
                      </span>
                      <span className="text-white/70">{open ? '▴' : '▾'}</span>
                    </Combobox.Button>

                    <div
                      className={`absolute z-50 mt-2 w-full overflow-auto rounded-xl bg-black/95 shadow-lg ring-1 ring-white/10 ${
                        open ? '' : 'hidden '
                      }`}
                    >
                      <div className="border-b border-white/10 p-2">
                        <ComboboxInput
                          value={searchMenu}
                          onChange={(e) => setSearchMenu(e.target.value)}
                          placeholder="جستجو..."
                          className="w-full rounded-lg bg-white/10 p-2 font-[Samim] text-white outline-none placeholder:text-white/50"
                        />
                      </div>
                      <ComboboxOptions className="no-scrollbar max-h-60 overflow-auto p-1">
                        {filterdMenu.length === 0 ? (
                          <div className="p-3 text-white/70">
                            موردی پیدا نشد
                          </div>
                        ) : (
                          filterdMenu
                            .filter((item) => item.isActive === true)
                            .map((menu) => (
                              <ComboboxOption
                                key={menu.id || 'no-parent'}
                                value={menu}
                                className={({ active, selected }) =>
                                  `cursor-pointer rounded-lg p-3 text-white ${
                                    active ? 'bg-black' : ''
                                  } ${selected ? 'bg-black' : ''}`
                                }
                              >
                                {menu.title}
                              </ComboboxOption>
                            ))
                        )}
                      </ComboboxOptions>
                    </div>
                  </div>
                )}
              </Combobox>
            </div>

            <label className="flex items-center gap-2 font-[Samim] text-white/80">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
              />
              فعال باشد
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={editing ? updateMenu : createMenu}
              className="hover: cursor-pointer rounded-xl bg-linear-to-tl from-green-900 to-green-500 px-4 py-2 font-[Samim] transition-all delay-100 duration-150 ease-in-out hover:scale-105"
            >
              {editing ? 'ذخیره تغییرات' : 'ایجاد'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Delete */}

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
          isDeleteModalOpen
            ? 'pointer-events-auto opacity-100 '
            : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

        <div
          className={`relative w-[500px] transform rounded-[15px] bg-linear-to-bl from-black to-gray-600 p-6 text-white shadow-2xl transition-all duration-300 ${
            isDeleteModalOpen
              ? 'translate-y-0 scale-100 opacity-100'
              : '-translate-y-10 scale-95 opacity-0'
          }`}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-[SamimBold] text-lg">حذف منو</h2>
            <button
              onClick={closeDeleteModal}
              className="cursor-pointer rounded-[10px] bg-white/80 p-1.5 text-[30px] text-red-500 transition-all delay-100 duration-75 ease-in-out hover:bg-black"
            >
              <img
                src={close}
                alt="close"
                width={20}
                className="transition-all delay-100 duration-100 ease-in-out hover:scale-110"
              />
            </button>
          </div>
          <p className="mt-4 font-[Samim] text-white/80">
            آیا از حذف این منو مطمئن هستید؟
          </p>

          <div className="mt-3 rounded-xl bg-white/5 p-3 font-[Samim] text-white/90">
            <div>عنوان: {deleteTarget?.title}</div>
            <div className="mt-1 text-white/70">نام: {deleteTarget?.name}</div>
            <div className="mt-1 text-white/70">
              url: {deleteTarget?.url ?? '—'}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={confirmDelete}
              className="cursor-pointer rounded-xl bg-linear-to-bl from-red-500 to-red-800 px-4 py-2 font-[Samim] transition-all delay-100 duration-150 ease-in-out hover:scale-105 hover:bg-red-500/60"
            >
              حذف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMenus;
