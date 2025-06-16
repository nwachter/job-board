"use client";

import { Star } from "lucide-react";
import { Skill } from "@/app/types/skill";

type OfferSkillsDisplayProps = {
  skills: Skill[];
  className?: string;
};

export default function OfferSkillsDisplay({
  skills,
  className = "",
}: OfferSkillsDisplayProps) {
  return (
    <div className="mb-4 max-h-60 overflow-y-auto rounded-lg border border-slate-200">
      <h2 className="border-b border-slate-100 px-4 py-2 text-lg font-bold">
        Competences requises
      </h2>
      {skills?.length > 0 ? (
        <div className="flex gap-1 px-4 py-2">
          {skills?.map((skill, i) => (
            <span
              key={`skill-${skill.id}`}
              className="hover:shadow-electric-purple-50 flex w-fit items-center justify-center rounded-3xl border border-slate-200 bg-electric-purple/5 px-4 py-2 text-left transition-all hover:bg-electric-purple hover:text-white hover:shadow-md"
            >
              {typeof skill === "object" && skill?.name !== undefined && (
                <span>{skill?.name}</span>
              )}
            </span>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-slate-500">
          Aucune compétence trouvée
        </div>
      )}
    </div>
  );
}
