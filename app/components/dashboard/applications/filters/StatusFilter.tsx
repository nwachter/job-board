import { FilterBase } from "@/app/components/general/modals/FilterBase";
import { Modal } from "@/app/components/general/modals/Modal";
import { Status } from "@/app/types/application";
import { Filter, ChevronDown } from "lucide-react";
import React from "react";

type StatusFilterProps = {
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<Status | "ALL">>;
  setIsOpenStatusFilter: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenStatusFilter: boolean;
};
export const StatusFilter: React.FC<StatusFilterProps> = ({
  statusFilter,
  setStatusFilter,
  setIsOpenStatusFilter,
  isOpenStatusFilter,
}) => {
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpenStatusFilter(true)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
      >
        <Filter size={16} className="text-gray-500" />
        Statut
        <ChevronDown size={16} className="text-gray-500" />
      </button>
      <FilterBase
        isOpen={isOpenStatusFilter}
        onClose={() => setIsOpenStatusFilter(false)}
      >
        <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${statusFilter === "ALL" ? "bg-purple-50 text-electric-purple" : ""}`}
          >
            Tous les statuts
          </button>
          <button
            onClick={() => setStatusFilter(Status.PENDING)}
            className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${statusFilter === Status.PENDING ? "bg-purple-50 text-electric-purple" : ""}`}
          >
            En attente
          </button>
          <button
            onClick={() => setStatusFilter(Status.ACCEPTED)}
            className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${statusFilter === Status.ACCEPTED ? "bg-purple-50 text-electric-purple" : ""}`}
          >
            Acceptées
          </button>
          <button
            onClick={() => setStatusFilter(Status.REJECTED)}
            className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${statusFilter === Status.REJECTED ? "bg-purple-50 text-electric-purple" : ""}`}
          >
            Refusées
          </button>
        </div>
      </FilterBase>
    </div>
  );
};
