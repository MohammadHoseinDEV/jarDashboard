import React from 'react';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import edit from '../../../../../assets/images/edit.png';
import delet from '../../../../../assets/images/delete.png';
import plus from '../../../../../assets/images/plus.png';
import close from '../../../../../assets/images/close.png';

import { fetchUserPermissions } from '../../../../auth/Slice/authSlice';
import { HashLoader } from 'react-spinners';
import API_HOST from '../../../../../../API/api';
import { useGetCompanies } from '../../../../../hooks/company/companiApi';

import Pagination from '../../../../../pagination/Pagination';

import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';

const LOCKED_MENU_URLS_FOR_SUPERADMIN = ['admin', 'admin-menus', 'admin-roles'];

const defaultPerm = {
  canView: false,
  canCreate: false,
  canEdit: false,
  canDelete: false,
};


const findMenuByUrl = (menus, url) => {
  for (const m of menus || []) {
    if (m?.url === url) return m;
    const hit = findMenuByUrl(m?.subMenus, url);
    if (hit) return hit;
  }
  return null;
};

const flattenMenus = (menus) => {
  const out = [];
  const walk = (arr, level = 0) => {
    for (const m of arr || []) {
      if (!m || m?.isActive === false) continue;
      out.push({ ...m, _level: level });
      if (Array.isArray(m?.subMenus) && m.subMenus.length) {
        walk(m.subMenus, level + 1);
      }
    }
  };
  walk(menus, 0);
  return out;
};

function AdminRoles() {
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { token, menus: userMenus } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pagePerm = useMemo(() => {
    const m = findMenuByUrl(userMenus, 'admin-roles');
    return {
      canView: !!m?.canView,
      canCreate: !!m?.canCreate,
      canEdit: !!m?.canEdit,
      canDelete: !!m?.canDelete,
    };
  }, [userMenus]);

  const canCreate = pagePerm.canCreate;
  const canEdit = pagePerm.canEdit;
  const canDelete = pagePerm.canDelete;

  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  );

  const refetchRoles = () =>
    queryClient.invalidateQueries({ queryKey: ['admin-roles-list'] });

  /** -----------------------------
   * Roles list
   * ----------------------------- */
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-roles-list', page, pageSize, search],
    enabled: !!token,
    keepPreviousData: true,
    queryFn: async () => {
      const res = await axios.get(`${API_HOST}:5257/api/role`, {
        headers,
        params: { page, pageSize, search },
      });
      return res.data;
    },
  });

  const roles = data?.roles ?? [];

  const totalPages = data?.totalPages ?? 1;

  /** -----------------------------
   * Create/Edit Role Modal
   * ----------------------------- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchCompany, setSearchCompany] = useState('');

  const [form, setForm] = useState({
    roleName: '',
    isGlobalAccess: true,
    companyId: '',
  });

  const resetForm = () => {
    setEditing(null);
    setForm({ roleName: '', isGlobalAccess: true, companyId: '' });
  };

  const openCreate = () => {
    if (!canCreate) return toast.error('شما دسترسی ایجاد ندارید');
    resetForm();
    setIsModalOpen(true);
  };

  const openEdit = (role) => {
    if (!canEdit) return toast.error('شما دسترسی ویرایش ندارید');

    setEditing(role);
    setForm({
      roleName: role?.name || '',
      isGlobalAccess: !!role?.isGlobalAccess,
      companyId: role?.companyId ?? '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const validateRole = () => {
    if (!form.roleName.trim()) return 'نام نقش الزامی است';
    if (!form.isGlobalAccess && !String(form.companyId).trim())
      return 'برای نقش شرکتی، companyId الزامی است';
    return null;
  };

  const createRole = async () => {
    if (!canCreate) return toast.error('شما دسترسی ایجاد ندارید');

    const msg = validateRole();
    if (msg) return toast.error(msg);

    const dto = {
      roleName: form.roleName.trim(),
      isGlobalAccess: !!form.isGlobalAccess,
      companyId: form.isGlobalAccess ? null : form.companyId,
    };

    try {
      await axios.post(`${API_HOST}:5257/api/role`, dto, { headers });
      toast.success('نقش ایجاد شد');
      closeModal();
      refetchRoles();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'خطا در ایجاد نقش');
    }
  };

  const updateRole = async () => {
    // if (!guardOrThrow({ perm: pagePerm, action: "edit", toast, message: "دسترسی ویرایش نقش ندارید" })) return;

    if (!canEdit) return toast.error('شما دسترسی ویرایش ندارید');
    if (!editing?.id) return;

    const msg = validateRole();
    if (msg) return toast.error(msg);

    const dto = {
      roleName: form.roleName.trim().toLowerCase(),
      isGlobalAccess: !!form.isGlobalAccess,
      companyId: form.isGlobalAccess ? null : form.companyId,
    };

    try {
      await axios.put(`${API_HOST}:5257/api/role/${editing.id}`, dto, {
        headers,
      });
      toast.success('نقش ویرایش شد');
      closeModal();
      refetchRoles();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'خطا در ویرایش نقش');
    }
  };

  const { data: company } = useGetCompanies();

  const getCompany = useMemo(() => {
    const none = { id: '', name: 'انتخاب شرکت', isActive: true };

    return [
      none,
      ...(company?.companies ?? []).map((c) => ({
        id: c.id,
        name: c.name,
        isActive: c.isActive,
      })),
    ];
  }, [company]);

  const filterCompany = useMemo(() => {
    const q = searchCompany.trim().toLowerCase();
    if (!q) return getCompany;

    return getCompany.filter((c) => (c?.name || '').toLowerCase().includes(q));
  }, [searchCompany, getCompany]);

  const selectedCompany = useMemo(() => {
    return getCompany.find((c) => c.id === form.companyId) || getCompany[0];
  }, [getCompany, form.companyId]);

  /** -----------------------------
   * Delete Role Modal
   * ----------------------------- */
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const askDelete = (role) => {
    if (!canDelete) return toast.error('شما دسترسی حذف ندارید');
    setDeleteTarget(role);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    // if (!guardOrThrow({ perm: pagePerm, action: "delete", toast, message: "دسترسی حذف نقش ندارید" })) return;

    if (!canDelete) return toast.error('شما دسترسی حذف ندارید');
    if (!deleteTarget?.id) return;

    try {
      await axios.delete(`${API_HOST}:5257/api/role/${deleteTarget.id}`, {
        headers,
      });
      toast.success('نقش حذف شد');
      closeDeleteModal();
      refetchRoles();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'خطا در حذف نقش');
    }
  };

  /** -----------------------------
   * Assign Menus Modal
   * ----------------------------- */
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignRole, setAssignRole] = useState(null);

  // menuPerms: { [menuId]: {canView, canCreate, canEdit, canDelete} }
  const [menuPerms, setMenuPerms] = useState({});

  const isSuperAdminRole = assignRole?.name === 'SuperAdmin';

  const openAssignMenus = (role) => {
    setAssignRole(role);
    setIsAssignModalOpen(true);
  };

  const closeAssignMenus = () => {
    setIsAssignModalOpen(false);
    setAssignRole(null);
    setMenuPerms({});
  };

  const { data: allMenusTree, isLoading: allMenusLoading } = useQuery({
    queryKey: ['all-menus-for-assign'],
    enabled: !!token && isAssignModalOpen,
    queryFn: async () => {
      const res = await axios.get(
        `${API_HOST}:5257/api/MyMenu?page=1&pageSize=200`,
        {
          headers,
        }
      );
      return res.data?.menus ?? [];
    },
  });

  const allMenusFlat = useMemo(
    () => flattenMenus(allMenusTree),
    [allMenusTree]
  );

  const { data: roleMenusData, isLoading: roleMenusLoading } = useQuery({
    queryKey: ['role-menus', assignRole?.id],
    enabled: !!token && isAssignModalOpen && !!assignRole?.id,
    queryFn: async () => {
      const res = await axios.get(
        `${API_HOST}:5257/api/role/${assignRole.id}/menus`,
        {
          headers,
        }
      );
      return res.data; // معمولاً array
    },
  });

  // ساخت menuPerms اولیه برای *همه منوها* (نه فقط اونایی که تو roleMenusData هست)
  useEffect(() => {
    if (!isAssignModalOpen) return;
    if (!Array.isArray(allMenusFlat)) return;

    // ابتدا همه false
    const next = {};
    for (const m of allMenusFlat) {
      next[m.id] = { ...defaultPerm };
    }

    // سپس با دسترسی‌های role پرش کن
    if (Array.isArray(roleMenusData)) {
      for (const rm of roleMenusData) {
        if (!rm?.menuId) continue;
        next[rm.menuId] = {
          canView: !!rm.canView,
          canCreate: !!rm.canCreate,
          canEdit: !!rm.canEdit,
          canDelete: !!rm.canDelete,
        };
      }
    }

    setMenuPerms(next);
  }, [roleMenusData, allMenusFlat, isAssignModalOpen]);

  // قفل SuperAdmin برای منوهای حیاتی
  useEffect(() => {
    if (!isAssignModalOpen) return;
    if (!isSuperAdminRole) return;
    if (!Array.isArray(allMenusFlat)) return;

    const mustIds = allMenusFlat
      .filter((m) => LOCKED_MENU_URLS_FOR_SUPERADMIN.includes(m?.url))
      .map((m) => m.id);

    if (mustIds.length === 0) return;

    setMenuPerms((prev) => {
      const copy = { ...prev };
      for (const id of mustIds) {
        copy[id] = {
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true,
        };
      }
      return copy;
    });
  }, [allMenusFlat, isAssignModalOpen, isSuperAdminRole]);

  const getMenuPerm = (menuId) => menuPerms[menuId] ?? defaultPerm;

  const setPerm = (menuId, patch) => {
    setMenuPerms((prev) => {
      const current = prev[menuId] ?? defaultPerm;
      const next = { ...current, ...patch };

      // اگر canView خاموش شد، بقیه هم خاموش
      if (patch?.canView === false) {
        next.canCreate = false;
        next.canEdit = false;
        next.canDelete = false;
      }

      // اگر create/edit/delete روشن شد ولی view خاموش بود، view خودکار روشن شود
      const turningOnAction =
        (patch?.canCreate === true && current.canCreate === false) ||
        (patch?.canEdit === true && current.canEdit === false) ||
        (patch?.canDelete === true && current.canDelete === false);

      if (turningOnAction && next.canView === false) {
        next.canView = true;
      }

      return { ...prev, [menuId]: next };
    });
  };

  const isLockedMenu = (menu) =>
    isSuperAdminRole &&
    LOCKED_MENU_URLS_FOR_SUPERADMIN.includes(menu?.url || '');

  const saveAssignMenus = async (e) => {
    e.preventDefault();
    if (!assignRole?.id) return;

    //  payload کامل برای همه منوها
    const menusPayload = (allMenusFlat || []).map((m) => {
      const p = menuPerms[m.id] ?? defaultPerm;
      return {
        menuId: m.id,
        canView: !!p.canView,
        canCreate: !!p.canCreate,
        canEdit: !!p.canEdit,
        canDelete: !!p.canDelete,
      };
    });

    // تضمین منوهای قفل برای SuperAdmin
    if (isSuperAdminRole) {
      for (const m of allMenusFlat || []) {
        if (!LOCKED_MENU_URLS_FOR_SUPERADMIN.includes(m?.url)) continue;
        const idx = menusPayload.findIndex((x) => x.menuId === m.id);
        if (idx >= 0) {
          menusPayload[idx] = {
            menuId: m.id,
            canView: true,
            canCreate: true,
            canEdit: true,
            canDelete: true,
          };
        }
      }
    }

    try {
      const dto = { roleId: assignRole.id, menus: menusPayload };
      await axios.post(`${API_HOST}:5257/api/role/assign-menus`, dto, {
        headers,
      });

      toast.success('دسترسی منوها ذخیره شد');
      closeAssignMenus();

      // اگر کاربر فعلی همون نقشه/نقش تغییر کرده، permissions را ریفرش کن
      // dispatch(fetchUserPermissions(token));
    } catch (e) {
      toast.error(e?.response?.data?.message || 'خطا در ذخیره دسترسی‌ها');
    }
  };

  const renderMenuRow = (menu, level = 0) => {
    if (!menu || menu?.isActive === false) return null;

    const locked = isLockedMenu(menu);
    const perm = getMenuPerm(menu.id);

    return (
      <div>
        {mobile ? (
          <div>
            <div>
              <div key={menu.id} className="mb-2">
                <div
                  className="flex flex-col gap-2 rounded-xl bg-white/5 py-5"
                  style={{ marginRight: level * 18 }}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center justify-start pr-3 text-right font-[SamimBold] text-[20px]">
                      {level > 0 ? '↳ ' : ''}
                      {menu.title}{' '}
                      {locked && (
                        <span className="mr-2 rounded bg-white/10 px-2 py-0.5 text-xs text-white/70">
                          قفل
                        </span>
                      )}
                    </div>

                    <div className="m-auto grid grid-cols-2 gap-7 space-x-3 pt-4 text-xs text-white/80">
                      <label className="flex items-center gap-1 font-[VazirLight] text-[20px]">
                        <input
                          type="checkbox"
                          checked={perm.canView}
                          className="size-5"
                          disabled={locked}
                          onChange={(e) =>
                            setPerm(menu.id, { canView: e.target.checked })
                          }
                        />
                        مشاهده
                      </label>

                      <label className="flex items-center gap-1 font-[VazirLight] text-[20px]">
                        <input
                          type="checkbox"
                          checked={perm.canCreate}
                          className="size-5"
                          disabled={locked || !perm.canView}
                          onChange={(e) =>
                            setPerm(menu.id, { canCreate: e.target.checked })
                          }
                        />
                        ایجاد
                      </label>

                      <label className="flex items-center gap-1 font-[VazirLight] text-[20px]">
                        <input
                          type="checkbox"
                          checked={perm.canEdit}
                          className="size-5"
                          disabled={locked || !perm.canView}
                          onChange={(e) =>
                            setPerm(menu.id, { canEdit: e.target.checked })
                          }
                        />
                        ویرایش
                      </label>

                      <label className="flex items-center gap-1 font-[VazirLight] text-[20px]">
                        <input
                          type="checkbox"
                          checked={perm.canDelete}
                          className="size-5"
                          disabled={locked || !perm.canView}
                          onChange={(e) =>
                            setPerm(menu.id, { canDelete: e.target.checked })
                          }
                        />
                        حذف
                      </label>
                    </div>
                  </div>

                  {Array.isArray(menu.subMenus) && menu.subMenus.length > 0 && (
                    <div className="m-5 mt-2 flex flex-col">
                      {menu.subMenus
                        .filter((s) => s?.isActive !== false)
                        .map((s) => (
                          <div key={s.id}>{renderMenuRow(s, level + 1)}</div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div key={menu.id} className="mb-2">
              <div
                className="flex flex-col gap-2 rounded-xl bg-white/5 p-3"
                style={{ marginRight: level * 18 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-[Samim]">
                    {level > 0 ? '↳ ' : ''}
                    {menu.title}{' '}
                    {/* <span className="text-white/50">({menu.url || '-'})</span> */}
                    {locked && (
                      <span className="mr-2 rounded bg-white/10 px-2 py-0.5 text-xs text-white/70">
                        قفل
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-3 text-center text-white/80">
                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={perm.canView}
                        disabled={locked}
                        onChange={(e) =>
                          setPerm(menu.id, { canView: e.target.checked })
                        }
                        className="size-4"
                      />
                      مشاهده
                    </label>

                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={perm.canCreate}
                        disabled={locked || !perm.canView}
                        onChange={(e) =>
                          setPerm(menu.id, { canCreate: e.target.checked })
                        }
                        className="size-4"
                      />
                      ایجاد
                    </label>

                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={perm.canEdit}
                        disabled={locked || !perm.canView}
                        onChange={(e) =>
                          setPerm(menu.id, { canEdit: e.target.checked })
                        }
                        className="size-4"
                      />
                      ویرایش
                    </label>

                    <label className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={perm.canDelete}
                        disabled={locked || !perm.canView}
                        onChange={(e) =>
                          setPerm(menu.id, { canDelete: e.target.checked })
                        }
                        className="size-4"
                      />
                      حذف
                    </label>
                  </div>
                </div>

                {Array.isArray(menu.subMenus) && menu.subMenus.length > 0 && (
                  <div className="mt-2">
                    {menu.subMenus
                      .filter((s) => s?.isActive !== false)
                      .map((s) => (
                        <div key={s.id}>{renderMenuRow(s, level + 1)}</div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-[15px] bg-[#0F090C]/30 p-6 text-white">
      <div>
        {mobile ? (
          <div>
            <div className="flex flex-col">
              <h1 className="pb-2 text-center font-[SamimBold] text-[30px]">
                مدیریت نقش
              </h1>
              <input
                type="text"
                placeholder="جستجو ..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
                className="mx-1 mb-5 rounded-2xl border border-white/70 py-2 pr-2 outline-none placeholder:text-white focus:bg-white/70 focus:text-black focus:placeholder:text-black"
              />
              <button
                disabled={!canCreate}
                onClick={openCreate}
                className={`rounded-xl px-4 py-2 font-[Samim] ${
                  canCreate
                    ? 'bg-white/10 hover:bg-white/15'
                    : 'bg-white/5 opacity-50'
                }`}
              >
                + افزودن نقش
              </button>
            </div>
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
              <div className="no-scrollbar h-100 overflow-y-auto">
                {roles?.map((role) => (
                  <div key={role.id}>
                    <React.Fragment>
                      <div className="my-2 rounded-2xl border border-white/50 bg-black/40 pr-2">
                        <p className="space-x-1 pt-3 text-[20px]">
                          <span className="font-[SamimBold]">نام نقش: </span>
                          <span className="font-[Samim]">{role.name}</span>
                        </p>
                        <p className="space-x-1 pt-3 font-[VazirLight] text-[18px]">
                          <span>نوع: </span>
                          <span>
                            {role.isGlobalAccess ? 'سراسری' : 'شرکتی'}
                          </span>
                        </p>
                        <p className="space-x-1 pt-3 pb-3 font-[VazirLight] text-[18px]">
                          <span>شرکت: </span>
                          <span>{role.companyName ?? '---'}</span>
                        </p>

                        <p className="m-auto flex items-center justify-center space-x-1 pt-1 pb-2 text-[14px]">
                          <button
                            disabled={!canEdit}
                            onClick={() => openEdit(role)}
                            className={`mb-2 cursor-pointer rounded-[10px] p-2 font-[Samim] ${
                              canEdit
                                ? 'cursor-pointer bg-linear-to-bl from-green-500/10 to-green-800/50 transition-all delay-100 duration-150 ease-in-out hover:scale-106'
                                : 'bg-white/5 opacity-50'
                            }`}
                          >
                            <img src={edit} alt="edit" width={25} />
                          </button>
                          <button
                            disabled={!canDelete}
                            onClick={() => askDelete(role)}
                            className={`mb-2 cursor-pointer rounded-[10px] p-2 font-[Samim] ${
                              canDelete
                                ? 'cursor-pointer bg-linear-to-bl from-red-500/10 to-red-800/50 transition-all delay-100 duration-150 ease-in-out hover:scale-106'
                                : 'bg-white/5 opacity-50'
                            }`}
                          >
                            <img src={delet} alt="delete" width={25} />
                          </button>
                          <button
                            onClick={() => openAssignMenus(role)}
                            className="mb-2 cursor-pointer rounded-[10px] bg-[#f35714]/80 px-3 py-2 font-[Samim] hover:bg-[#f35714]/40"
                          >
                            دسترسی منو
                          </button>
                        </p>
                      </div>
                    </React.Fragment>
                  </div>
                ))}
                <Pagination
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                />
              </div>
            )}
          </div>
        ) : (
          // Desktop
          <div className="rounded-[15px] bg-[#0F090C]/40 p-6 text-white">
            <div className="flex items-center justify-between rounded-2xl border border-white/70 bg-[#0F090c]/30 px-2">
              <input
                type="text"
                placeholder="جستجو..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
                className="my-4 mr-2 w-[300px] rounded-xl bg-white/10 p-3 font-[SamimBold] text-white outline-none placeholder:text-white focus:bg-white/70 focus:text-black focus:placeholder:text-black"
              />
              <h1 className="font-[SamimBold] text-xl">مدیریت نقش‌ ها</h1>

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
                  افزودن نقش جدید
                </span>
                <span className="transition-all delay-150 duration-700 ease-in-out group-hover:rotate-360">
                  <img src={plus} alt="plus" width={30} />
                </span>
              </button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-5 py-50">
                <HashLoader color="#ffffff" size={80} speedMultiplier={1.5} />
                <p className="pt-8 text-[20px]">لطفا منتظر بمانید😎</p>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center space-y-5 py-50 text-[25px]">
                خطا در دریافت اطلاعات 😟
              </div>
            ) : (
              <>
                <div className="no-scrollbar mt-6 max-h-140 overflow-auto rounded-2xl border border-white/70">
                  <table className="w-full border-separate border-spacing-y-2 px-5 pt-3">
                    <thead>
                      <tr className="text-right text-white/70">
                        <th className="px-3 font-[SamimBold] text-[20px]">
                          نام نقش
                        </th>
                        <th className="px-3 font-[SamimBold] text-[20px]">
                          نوع
                        </th>
                        <th className="px-3 font-[SamimBold] text-[20px]">
                          شرکت
                        </th>
                        <th className="px-3 font-[SamimBold] text-[20px]">
                          عملیات
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {roles?.map((r) => (
                        <tr key={r.id} className="rounded-xl bg-white/5">
                          <td className="px-3 py-3 font-[Samim]">{r.name}</td>

                          <td className="px-3 py-3 font-[Samim] text-white/80">
                            {r.isGlobalAccess ? 'سراسری' : 'شرکتی'}
                          </td>

                          <td className="px-3 py-3 font-[Samim] text-white/80">
                            {r.companyName ?? '—'}
                          </td>

                          <td className="px-3 py-3">
                            <div className="flex flex-wrap gap-2">
                              <button
                                disabled={!canEdit}
                                onClick={() => openEdit(r)}
                                className={`mb-2 cursor-pointer rounded-[10px] p-2 font-[Samim] ${
                                  canEdit
                                    ? 'cursor-pointer bg-linear-to-bl from-green-500/10 to-green-800/50 transition-all delay-100 duration-150 ease-in-out hover:scale-106'
                                    : 'bg-white/5 opacity-50'
                                }`}
                              >
                                <img src={edit} alt="edit" width={20} />
                              </button>

                              <button
                                disabled={!canDelete}
                                onClick={() => askDelete(r)}
                                className={`mb-2 cursor-pointer rounded-[10px] p-2 font-[Samim] ${
                                  canDelete
                                    ? 'cursor-pointer bg-linear-to-bl from-red-500/10 to-red-800/50 transition-all delay-100 duration-150 ease-in-out hover:scale-106'
                                    : 'bg-white/5 opacity-50'
                                }`}
                              >
                                <img src={delet} alt="delete" width={20} />
                              </button>

                              <button
                                onClick={() => openAssignMenus(r)}
                                className="cursor-pointer rounded-[10px] bg-linear-to-bl from-[#f35714]/95 to-[#f35714]/30 p-2 font-[Samim] transition-all delay-100 duration-150 ease-in-out hover:scale-106"
                              >
                                دسترسی منو
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {(roles || []).length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-3 py-6 text-center text-white/70"
                          >
                            نقشی وجود ندارد
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                />
              </>
            )}
          </div>
        )}

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
            <div className="flex items-center justify-between pb-5">
              <h2 className="font-[SamimBold] text-lg">
                {editing ? 'ویرایش نقش' : 'افزودن نقش'}
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
                placeholder="نام نقش (مثلاً SuperAdmin)"
                value={form.roleName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, roleName: e.target.value }))
                }
              />

              <label className="flex items-center gap-2 font-[Samim] text-white/80">
                <input
                  type="checkbox"
                  checked={form.isGlobalAccess}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      isGlobalAccess: e.target.checked,
                    }))
                  }
                />
                نقش سراسری باشد
              </label>

              {!form.isGlobalAccess && (
                <Combobox
                  value={selectedCompany}
                  onChange={(value) =>
                    setForm((p) => ({
                      ...p,
                      companyId: value?.id || null,
                    }))
                  }
                >
                  {({ open }) => (
                    <div className="relative">
                      <ComboboxButton className="flex w-full items-center justify-between rounded-xl bg-white/10 p-3 font-[Samim] text-white outline-none">
                        <span
                          className={
                            selectedCompany?.id ? 'text-white' : 'text-white/70'
                          }
                        >
                          {selectedCompany?.name || 'انتخاب شرکت...'}
                        </span>
                        <span className="text-white/70">
                          {open ? '▴' : '▾'}
                        </span>
                      </ComboboxButton>
                      <div
                        className={`absolute z-50 mt-2 w-full overflow-auto rounded-xl bg-black/95 shadow-lg ring-1 ring-white/10 ${
                          open ? '' : 'hidden '
                        }`}
                      >
                        <div className="border-b border-white/10 p-2">
                          <ComboboxInput
                            value={searchCompany}
                            onChange={(e) => setSearchCompany(e.target.value)}
                            placeholder="جستجو..."
                            className="w-full rounded-lg bg-white/10 p-2 font-[Samim] text-white outline-none placeholder:text-white/50"
                          />
                        </div>
                        <ComboboxOptions className="no-scrollbar max-h-60 overflow-auto p-1">
                          {filterCompany
                            ?.filter((c) => c.isActive === true)
                            ?.map((c) => (
                              <ComboboxOption
                                key={c.id}
                                value={c}
                                className={({ activ, selected }) =>
                                  `cursor-pointer rounded-lg p-3 text-white ${
                                    activ ? 'bg-black' : ''
                                  } ${selected ? 'bg-black' : ''}`
                                }
                              >
                                {c.name}
                              </ComboboxOption>
                            ))}
                        </ComboboxOptions>
                      </div>
                    </div>
                  )}
                </Combobox>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={editing ? updateRole : createRole}
                className="cursor-pointer rounded-xl bg-linear-to-tl from-green-900 to-green-500 px-4 py-2 font-[Samim] transition-all delay-100 duration-150 ease-in-out hover:scale-105"
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
              <h2 className="font-[SamimBold] text-lg">حذف نقش</h2>
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
              آیا از حذف این نقش مطمئن هستید؟
            </p>

            <div className="mt-3 rounded-xl bg-white/5 p-3 font-[Samim] text-white/90">
              <div>نام نقش: {deleteTarget?.name}</div>
              <div className="mt-1 text-white/70">
                نوع: {deleteTarget?.isGlobalAccess ? 'سراسری' : 'شرکتی'}
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

        {/* Modal Assign Menus */}
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
            isAssignModalOpen
              ? 'pointer-events-auto opacity-100 '
              : 'pointer-events-none opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

          <div
            className={`relative w-[1000px] transform rounded-[15px] bg-linear-to-bl from-black to-gray-600 p-6 text-white shadow-2xl transition-all duration-300 ${
              isAssignModalOpen
                ? 'translate-y-0 scale-100 opacity-100'
                : '-translate-y-10 scale-95 opacity-0'
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-[SamimBold] text-lg">
                دسترسی منو برای نقش: {assignRole?.name}
              </h2>
              <button
                onClick={() => {
                  setIsAssignModalOpen(false);
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

            {allMenusLoading || roleMenusLoading ? (
              <p className="mt-4 font-[Samim] text-white/70">
                در حال دریافت منوها...
              </p>
            ) : (
              <div className="no-scrollbar mt-4 max-h-[520px] overflow-y-auto rounded-xl bg-white/5 p-3">
                {(allMenusTree || [])
                  .filter((m) => m?.isActive !== false)
                  .map((m) => (
                    <div key={m.id}>{renderMenuRow(m, 0)}</div>
                  ))}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={saveAssignMenus}
                className="hover: cursor-pointer rounded-xl bg-linear-to-tl from-green-900 to-green-500 px-4 py-2 font-[Samim] transition-all delay-100 duration-150 ease-in-out hover:scale-105"
              >
                ذخیره دسترسی‌ها
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminRoles;
