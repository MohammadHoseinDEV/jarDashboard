import { useState } from 'react';

import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  FloatingFocusManager,
  FloatingNode,
  FloatingTree,
} from '@floating-ui/react';
import { MdMoreVert } from 'react-icons/md';

import edit from '../../../../assets/images/edit.png';
import deleteIcon from '../../../../assets/images/delete.png';
import form from '../../../../assets/images/form.png';
import { useGetProfile } from '../../../../hooks/profile/profile';

function ReportActionBachplant({
  report,
  canEdit,
  canDelete,
  openEdit,
  askDelete,
  setOpenFormReport,
  setSelectedReport,
}) {
  if (!report) return null;

  const [isOpen, setIsOpen] = useState(false);

  const { data: profile } = useGetProfile();

  const isSuperAdmin = profile?.data?.identityRoles?.some(
    (p) => p.roleId === 'cfa79204-d797-4241-8630-55fcc1b2f721'
  );

  const isSupervisor = profile?.data?.companyRoles?.some(
    (p) =>
      p.roleId === 'e4a2f36a-a4da-42b0-b0c0-284bddb423ac' ||
      p.roleId === '18783471-a9eb-4328-8d98-8fccbb6cab46' ||
      p.roleId === 'e8d691c5-827c-4c65-9d1a-14def8620ade'
  );

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(5), flip(), shift()],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [click, dismiss, role]
  );

  const handleOpenForm = () => {
    setSelectedReport(report);
    setOpenFormReport(true);
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        onClick={(e) => {
          e.stopPropagation();

          setSelectedReport(report);
          setIsOpen(!isOpen);
        }}
        className="cursor-pointer text-2xl text-white/60 transition-all delay-100 duration-150 hover:scale-105 hover:text-white"
      >
        <MdMoreVert />
      </button>

      <FloatingPortal>
        {isOpen && (
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className="absolute top-full left-0 z-9999 flex w-[200px] cursor-pointer flex-col items-start space-y-1 rounded-[15px] bg-black p-3 shadow-lg"
            >
              <div className="flex w-full items-center space-x-1 border-b border-white/50 pr-1 pb-1 font-[SamimBold] text-white">
                <p>{report?.operatorName}</p>
              </div>

              {((canEdit &&
                profile?.data?.id === report?.createdBy &&
                !report?.isSignedByShiftLeader) ||
                (canEdit &&
                  isSupervisor &&
                  !report?.isSignedByUnitSupervisor) ||
                isSuperAdmin) && (
                <div
                  {...getItemProps({
                    onClick: (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openEdit(report);
                      setIsOpen(false);
                    },
                  })}
                  className="flex w-full space-x-2 rounded-[5px] py-1 transition-all delay-75 duration-100 hover:bg-white/20"
                >
                  <button
                    className={`cursor-pointer rounded-[10px] p-2 font-[Samim] max-xl:p-1 ${'cursor-pointer transition-all delay-100 duration-150 ease-in-out hover:scale-106'}`}
                  >
                    <img src={edit} alt="edit" width={20} />
                  </button>
                  <p className="my-auto flex text-white">ویرایش</p>
                </div>
              )}

              {((canDelete && !report?.isSignedByUnitSupervisor) ||
                isSuperAdmin) && (
                <div
                  {...getItemProps({
                    onClick: (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      askDelete(report);
                      setIsOpen(false);
                    },
                  })}
                  className="flex w-full space-x-2 rounded-[5px] py-1 transition-all delay-75 duration-100 hover:bg-white/20"
                >
                  <button
                    className={`cursor-pointer rounded-[10px] p-2 font-[Samim] max-xl:p-1 ${'cursor-pointer transition-all delay-100 duration-150 ease-in-out hover:scale-106 '}`}
                  >
                    <img src={deleteIcon} alt="delete" width={20} />
                  </button>
                  <p className="my-auto flex text-white">حذف</p>
                </div>
              )}

              <div
                {...getItemProps({
                  onClick: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOpenForm();
                  },
                })}
                className="flex w-full space-x-2 rounded-[5px] p-1 py-1 transition-all delay-75 duration-100 hover:scale-103 hover:bg-white/20"
              >
                <img
                  src={form}
                  alt="form"
                  width={25}
                  className="flex space-x-2 rounded-[5px] py-1 transition-all delay-75 duration-100"
                />

                <p className="my-auto font-[VazirLight] text-white">نمایش</p>
              </div>
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </>
  );
}

export { ReportActionBachplant };
