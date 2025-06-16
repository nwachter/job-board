"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Search, Plus, X, Check, Star } from "lucide-react";
import { Skill } from "@/app/types/skill";
import { motion, AnimatePresence } from "framer-motion";
import { updateUser } from "@/app/services";
import { useUpdateUser } from "@/app/hooks/useUser";

type UserSkillsSelectorProps = {
  userSkills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
  className?: string;
  allSkills: Skill[];
  isEditing?: boolean; // Add this
};

export default function UserSkillsSelector({
  userSkills = [],
  onSkillsChange,
  className = "",
  allSkills = [],
  isEditing = true,
}: UserSkillsSelectorProps) {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>(userSkills);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState(3);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);

  useEffect(() => {
    //add
    setSelectedSkills(userSkills);
  }, [userSkills]);

  useEffect(() => {
    // Filter out skills that are already selected
    const filteredAvailableSkills = allSkills.filter(
      (skill) => !selectedSkills.some((selected) => selected.id === skill.id),
    );

    setAvailableSkills(filteredAvailableSkills);
    setFilteredSkills(filteredAvailableSkills);
  }, [selectedSkills]);

  // Filter available skills based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSkills(availableSkills);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = availableSkills.filter((skill) =>
      skill.name.toLowerCase().includes(term),
    );
    setFilteredSkills(filtered);
  }, [searchTerm, availableSkills]);

  // Add a skill to selected skills
  const addSkill = (skill: Skill) => {
    const newSkill = { ...skill, level: 3 }; // Default level
    setSelectedSkills((prev) => [...prev, newSkill]);
    onSkillsChange([...selectedSkills, newSkill]);
  };

  // Remove a skill from selected skills
  const removeSkill = (skillId: number) => {
    setSelectedSkills((prev) => prev.filter((skill) => skill.id !== skillId));
    onSkillsChange(selectedSkills.filter((skill) => skill.id !== skillId));
  };

  // Update skill level
  const updateSkillLevel = async (skillId: number, level: number) => {
    setSelectedSkills((prev) =>
      prev.map((skill) => (skill.id === skillId ? { ...skill, level } : skill)),
    );

    const updatedSkills = selectedSkills.map((skill) =>
      skill.id === skillId ? { ...skill, level } : skill,
    );

    onSkillsChange(updatedSkills);
  };

  // Add custom skill
  const addCustomSkill = () => {
    if (!newSkillName.trim()) return;

    // Generate a unique ID (in a real app, this would be handled by the backend)
    const newId =
      Math.max(
        0,
        ...availableSkills.map((s) => s.id),
        ...selectedSkills.map((s) => s.id),
      ) + 1;

    const newSkill: Skill = {
      id: newId,
      name: newSkillName.trim(),
      level: newSkillLevel,
    };

    setSelectedSkills((prev) => [...prev, newSkill]);
    onSkillsChange([...selectedSkills, newSkill]);
    setNewSkillName("");
    setNewSkillLevel(3);
    setShowSkillModal(false);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selected Skills */}
      <div className="flex items-center gap-3">
        {selectedSkills.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
            <p className="text-gray-500">Aucune compétence sélectionnée</p>
            <button
              onClick={() => setShowSkillModal(true)}
              type="button"
              className="mt-2 text-sm text-electric-purple hover:underline"
            >
              Ajouter des compétences
            </button>
          </div>
        ) : (
          selectedSkills.map((skill) => (
            <div
              key={skill.id}
              className="flex w-fit items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center">
                <span className="font-base text-[13px] text-eggplant/60">
                  {skill.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-[3px]">
                  {skill.level !== undefined &&
                    [1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => updateSkillLevel(skill.id, level)}
                        className={`h-fit w-fit ${level <= skill.level! ? "text-electric-purple" : "text-gray-300"} hover:text-electric-purple`}
                      >
                        <Star
                          size={16}
                          fill={level <= skill.level! ? "currentColor" : "none"}
                        />
                      </button>
                    ))}
                </div>

                {isEditing && (
                  <button
                    onClick={() => removeSkill(skill.id)}
                    type="button"
                    className="ml-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Skill Modal */}
      <AnimatePresence>
        {showSkillModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Ajouter une compétence
                </h3>
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search existing skills */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une compétence..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-electric-purple focus:outline-none focus:ring-1 focus:ring-electric-purple"
                  />
                </div>
              </div>

              {/* Available skills */}
              <div className="mb-4 max-h-60 overflow-y-auto rounded-lg border border-gray-200">
                {filteredSkills.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredSkills.map((skill) => (
                      <button
                        type="button"
                        key={skill.id}
                        onClick={() => addSkill(skill)}
                        className="flex w-full items-center justify-between px-4 py-2 text-left hover:bg-purple-50"
                      >
                        <span>{skill.name}</span>
                        <Plus size={16} className="text-electric-purple" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Aucune compétence trouvée
                  </div>
                )}
              </div>

              {/* Add custom skill */}
              <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Ajouter une nouvelle compétence
                </h4>

                <div>
                  <input
                    type="text"
                    placeholder="Nom de la compétence"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-electric-purple focus:outline-none focus:ring-1 focus:ring-electric-purple"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-600">
                    Niveau
                  </label>
                  <div className="flex items-center justify-between">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          type="button"
                          key={level}
                          onClick={() => setNewSkillLevel(level)}
                          className={`h-8 w-8 ${level <= newSkillLevel ? "text-electric-purple" : "text-gray-300"} hover:text-electric-purple`}
                        >
                          <Star
                            size={20}
                            fill={
                              level <= newSkillLevel ? "currentColor" : "none"
                            }
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {newSkillLevel === 1 && "Débutant"}
                      {newSkillLevel === 2 && "Intermédiaire"}
                      {newSkillLevel === 3 && "Avancé"}
                      {newSkillLevel === 4 && "Expert"}
                      {newSkillLevel === 5 && "Maître"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={addCustomSkill}
                  disabled={!newSkillName.trim()}
                  className="flex items-center gap-1 rounded-lg bg-electric-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:bg-purple-300"
                >
                  <Check size={16} />
                  Ajouter
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

type OfferSkillsSelectorProps = {
  onSkillsChange: (skills: Omit<Skill, "id">[]) => void;
  className?: string;
  existingSkills?: Skill[];
  selectedSkills: { name: string }[];
  setSelectedSkills: Dispatch<SetStateAction<Omit<Skill, "id">[]>>;
};

export function OfferSkillsSelector({
  onSkillsChange,
  className = "",
  existingSkills = [],
  selectedSkills,
  setSelectedSkills,
}: OfferSkillsSelectorProps) {
  // const [selectedSkills, setSelectedSkills] = useState<Omit<Skill, "id">[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);

  useEffect(() => {
    // Filter existing skills based on what's already selected
    const filteredExistingSkills = existingSkills.filter(
      (skill) =>
        !selectedSkills.some((selected) => selected.name === skill.name),
    );

    setFilteredSkills(filteredExistingSkills);
  }, [selectedSkills, existingSkills]);

  // Filter available skills based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSkills(
        existingSkills.filter(
          (skill) =>
            !selectedSkills.some((selected) => selected.name === skill.name),
        ),
      );
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = existingSkills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(term) &&
        !selectedSkills.some((selected) => selected.name === skill.name),
    );

    setFilteredSkills(filtered);
  }, [searchTerm, existingSkills, selectedSkills]);

  // Add a skill to selected skills
  const addSkill = (skill: Skill) => {
    const newSkill = { name: skill.name };
    setSelectedSkills((prev) => [...prev, newSkill]);
    onSkillsChange([...selectedSkills, newSkill]);
    setSearchTerm("");
  };

  // Remove a skill from selected skills
  const removeSkill = (skillName: string) => {
    setSelectedSkills((prev) =>
      prev.filter((skill) => skill.name !== skillName),
    );

    // onSkillsChange(selectedSkills.filter((skill) => skill.name !== skillName));
  };

  // Add custom skill
  const addCustomSkill = () => {
    if (!newSkillName.trim()) return;

    // Check if skill already exists in selected skills
    if (
      selectedSkills.some(
        (skill) =>
          skill.name.toLowerCase() === newSkillName.trim().toLowerCase(),
      )
    ) {
      alert("Cette compétence est déjà ajoutée");
      return;
    }

    const newSkill = { name: newSkillName.trim() };

    setSelectedSkills((prev) => [...prev, newSkill]);
    // onSkillsChange([...selectedSkills, newSkill]);
    setNewSkillName("");
    setShowSkillModal(false);
  };

  ///

  ///

  // Show the add skill button
  const showAddSkillButton = () => {
    return (
      <button
        onClick={() => setShowSkillModal(true)}
        type="button"
        className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 p-3 text-sm text-purple-600 transition-colors hover:bg-purple-50 hover:text-purple-700"
      >
        <Plus size={18} />
        <span>Ajouter une compétence requise</span>
      </button>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-wrap items-center gap-3">
        {selectedSkills.length === 0 ? (
          <div className="w-full rounded-lg border-2 border-dashed border-gray-200 p-6 text-center">
            <p className="text-gray-500">Aucune compétence sélectionnée</p>
            <button
              onClick={() => setShowSkillModal(true)}
              type="button"
              className="mt-2 text-sm text-purple-600 hover:underline"
            >
              Ajouter des compétences requises
            </button>
          </div>
        ) : (
          <>
            {selectedSkills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm transition-all hover:shadow-md"
              >
                <span className="font-medium text-gray-700">{skill.name}</span>
                <button
                  onClick={() => removeSkill(skill.name)}
                  type="button"
                  className="ml-1 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            {showAddSkillButton()}
          </>
        )}
      </div>

      {/* Add Skill Modal */}
      <AnimatePresence>
        {showSkillModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Ajouter une compétence requise
                </h3>
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Search existing skills */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une compétence..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              {/* Available skills */}
              <div className="mb-4 max-h-60 overflow-y-auto rounded-lg border border-gray-200">
                {filteredSkills.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredSkills.map((skill) => (
                      <button
                        type="button"
                        key={skill.id}
                        onClick={() => addSkill(skill)}
                        className="flex w-full items-center justify-between px-4 py-2 text-left hover:bg-purple-50"
                      >
                        <span>{skill.name}</span>
                        <Plus size={16} className="text-purple-600" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Aucune compétence trouvée
                  </div>
                )}
              </div>

              {/* Add custom skill */}
              <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h4 className="text-sm font-medium text-gray-700">
                  Ajouter une nouvelle compétence
                </h4>

                <div>
                  <input
                    type="text"
                    placeholder="Nom de la compétence"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={addCustomSkill}
                  disabled={!newSkillName.trim()}
                  className="flex items-center gap-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:bg-purple-300"
                >
                  <Check size={16} />
                  Ajouter
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
