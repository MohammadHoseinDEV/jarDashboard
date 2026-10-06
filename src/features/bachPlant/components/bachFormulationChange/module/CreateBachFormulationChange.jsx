import React, { useEffect, useState } from "react";
import CreateBachFormulationChangeJsx from "../template/CreateBachFormulationChangeJsx";
import { useGetProfile } from "../../../../../hooks/profile/profile";
import { useCreateBachfourmulation } from "../../../Api/bachFormulationChange";
import { getToday, toShamsi } from "../../../../../Time/date";

const matierialName = [
  { id: 1, name: "سیلیس" },
  { id: 2, name: "کربنات" },
  { id: 3, name: "دولومیت" },
  { id: 4, name: "آهک" },
  {
    id: 5,
    name: "سولفات سدیم",
  },
  { id: 6, name: "فلدسپار" },
];

const realTime = new Date().toISOString().slice(11, 19);
const realDate = new Date().toISOString()?.slice(0, 10);

const initioalState = {
  companyId: "",
  date: "",
  reportNumber: "",
  furnaceTonnage: "",
  totalBatchWeight: "",
  totalBatchWeight1: "",
  glassWastePercentageInBatch: "",
  glassWastePercentageInBatch1: "",
  glassWasteWeight: "",
  glassWasteWeight1: "",
  batchWeightWithGlassWaste: "",
  batchWeightWithGlassWaste1: "",
  changeRealDate: "",
  changeRealTime: "",
  notes: "",
  items: matierialName?.map((m) => ({
    materialName: m?.name,
    currentWeight: "",
    correctedWeight: "",
    weightPercentage: "",
    changeAmount: "",
    changeDate: "",
    changeTime: "",
    changeReason: "",
  })),
};

function CreateBachFormulationChange({ openCreateModal, setOpenCreateModal }) {
  const [form, setForm] = useState(initioalState);

  const { data: profile } = useGetProfile();

  const findcompany = profile?.data?.companyRoles.find(
    (c) => c.companyId,
  )?.companyId;

  useEffect(() => {
    if (profile?.data?.companyRoles) {
      setForm((p) => ({
        ...p,
        companyId: findcompany,
      }));
    }
  }, [profile]);

  const closeHandler = () => {
    setOpenCreateModal(false);
    setForm({
      ...initioalState,
      companyId: findcompany,
    });
  };

  const createReport = useCreateBachfourmulation();

  const submitHandler = (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      items: form.items?.map((item) => ({
        ...item,
        changeDate: realDate,
        changeTime: realTime,
      })),
    };

    createReport.mutate(payload, {
      onSuccess: () => {
        closeHandler();
      },
    });
  };
  return (
    <div
      className={`fixed inset-0 z-50 flex h-screen items-center justify-center overflow-auto p-4 transition-opacity duration-300 ${
        openCreateModal
          ? "pointer-events-auto opacity-100 "
          : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={closeHandler}
      />
      <div
        className={`relative flex max-h-[90vh] min-h-0 max-w-[80vw] transform flex-col overflow-hidden rounded-[15px] bg-linear-to-bl from-black to-gray-600 p-6 text-white shadow-2xl transition-all duration-300 max-2xl:scale-95 max-md:h-160 ${
          openCreateModal
            ? "translate-y-0 scale-100 opacity-100"
            : "-translate-y-10 scale-0 opacity-0"
        }`}
      >
        <CreateBachFormulationChangeJsx
          closeHandler={closeHandler}
          form={form}
          setForm={setForm}
          submitHandler={submitHandler}
        />
      </div>
    </div>
  );
}

export default CreateBachFormulationChange;
