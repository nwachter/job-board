"use client";

import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  ChevronDown,
  Mail,
  Check,
  Clock,
  Calendar,
  Link,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/DropdownMenu";
import { Checkbox } from "@/app/components/ui/Checkbox";
import { Input } from "@/app/components/ui/Input";
import { Button } from "@/app/components/ui/Button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";
import { Application } from "@/app/types/application";
import { useRouter } from "next/navigation";

interface RecentApplicationsProps {
  applications?: Application[];
  title?: string;
}

export function RecentApplications({
  applications,
  title = "Candidatures récentes",
}: RecentApplicationsProps) {
  console.log("Component applications : ", applications);
  const [selectedApplicants, setSelectedApplicants] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApplications = applications?.filter(
    (app) =>
      app?.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app?.lastname.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const applicants = applications?.map((app) => app.user);

  const handleSelectAll = () => {
    if (selectedApplicants.length === applications?.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(applications?.map((app) => Number(app.id)) || []);
    }
  };

  const toggleApplicant = (id: number) => {
    if (selectedApplicants.includes(id)) {
      setSelectedApplicants(selectedApplicants.filter((appId) => appId !== id));
    } else {
      setSelectedApplicants([...selectedApplicants, id]);
    }
  };

  const getDate = (date: string | Date) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "2-digit" });
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getTime = (date: string | Date) => {
    const dateObj = new Date(date);
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const minutesStr = minutes < 10 ? `0${minutes}` : String(minutes);
    return `${hours}:${minutesStr}`;
  };

  const router = useRouter();

  return (
    <div className="h-full overflow-hidden rounded-2xl border border-electric-purple/20 bg-white/90 shadow-lg shadow-electric-purple/5 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-electric-purple/10 p-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-eggplant">{title}</h3>
          {applications?.some(
            (app) =>
              app?.createdAt &&
              new Date(app.createdAt).getTime() >
                Date.now() - 1000 * 60 * 60 * 24 * 7,
          ) && (
            <div className="flex h-5 items-center justify-center rounded-full bg-electric-purple/10 px-2">
              <span className="text-xs font-medium text-electric-purple">
                New
              </span>
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4 text-eggplant/70" />
              <span className="sr-only">Plus d'options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/applications")}>
              Voir toutes les candidatures
            </DropdownMenuItem>
            {/* <DropdownMenuItem>Tout marquer comme lu</DropdownMenuItem> */}
            {/* <DropdownMenuItem>Exporter en CSV</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search and filters */}
      <div className="border-b border-electric-purple/10 p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-eggplant/50" />
          <Input
            placeholder="Search applicants..."
            className="border-electric-purple/20 bg-white/50 pl-9 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="select-all"
              checked={
                selectedApplicants.length === applications?.length &&
                applications?.length > 0
              }
              onCheckedChange={handleSelectAll}
              className="border-electric-purple/30 data-[state=checked]:bg-electric-purple data-[state=checked]:text-white"
            />
            <label
              htmlFor="select-all"
              className="cursor-pointer text-xs font-medium text-eggplant/70"
            >
              Tout Sélectionner
            </label>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 border-electric-purple/20 bg-white/50 text-xs font-medium text-eggplant/70"
              >
                <span>Trier par</span>
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>+ Récent</DropdownMenuItem>
              <DropdownMenuItem>+ Ancien</DropdownMenuItem>
              <DropdownMenuItem>Nom (A-Z)</DropdownMenuItem>
              <DropdownMenuItem>Nom (Z-A)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Applicants list */}
      <div className="old:max-h-[400px] overflow-y-auto">
        {filteredApplications && filteredApplications?.length > 0 ? (
          filteredApplications?.map((application) => (
            <div
              key={application.id}
              className={`flex items-center justify-between border-b border-electric-purple/10 p-3 transition-colors hover:bg-electric-purple/5 ${
                selectedApplicants.includes(application.id)
                  ? "bg-electric-purple/5"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedApplicants.includes(application.id)}
                  onCheckedChange={() => toggleApplicant(application.id)}
                  className="border-electric-purple/30 data-[state=checked]:bg-electric-purple data-[state=checked]:text-white"
                />
                <Avatar className="h-10 w-10 border border-electric-purple/20">
                  <AvatarImage
                    src={application?.user?.avatar || "/placeholder.svg"}
                    alt={application.firstname}
                  />
                  <AvatarFallback className="bg-electric-purple/10 text-electric-purple">
                    {application.firstname
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-eggplant">
                      {application.firstname} {application.lastname}
                    </p>
                    {application.createdAt &&
                      new Date(application?.createdAt).getTime() >
                        Date.now() - 1000 * 60 * 60 * 24 * 7 && (
                        <span className="h-2 w-2 rounded-full bg-electric-purple"></span>
                      )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-eggplant/60">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {application?.createdAt && (
                        <span>{getDate(application?.createdAt)}</span>
                      )}{" "}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {application.createdAt && (
                        <span>{getTime(application.createdAt)}</span>
                      )}{" "}
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-electric-purple hover:bg-electric-purple/10 hover:text-electric-purple"
              >
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email {application.firstname}</span>
              </Button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-electric-purple/10 p-3">
              <Search className="h-6 w-6 text-electric-purple" />
            </div>
            <h4 className="mt-4 text-sm font-medium text-eggplant">
              No applicants found
            </h4>
            <p className="mt-1 text-[12px] text-eggplant/60">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      {selectedApplicants.length > 0 && (
        <div className="border-t border-electric-purple/10 bg-electric-purple/5 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-eggplant">
              {selectedApplicants.length} selected
            </span>
            <div className="flex gap-2">
              {
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 border-electric-purple/20 bg-white/50 text-xs font-medium text-eggplant"
                >
                  Message
                </Button>
              }
              <Link href={`/applications`}>
                <Button
                  size="sm"
                  className="h-8 bg-electric-purple text-xs font-medium text-white hover:bg-electric-purple/90"
                >
                  Review
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
