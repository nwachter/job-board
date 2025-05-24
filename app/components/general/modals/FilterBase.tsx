"use client";
import { FC, useEffect, useRef } from "react";

type FilterBaseProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const FilterBase: FC<FilterBaseProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="z-50 h-full w-full bg-opacity-0">
      <div className="px-auto bg-opacity-0" ref={filterRef}>
        {children}
      </div>
    </div>
  );
};
