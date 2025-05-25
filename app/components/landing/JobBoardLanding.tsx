"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetUserInfo } from "@/app/hooks/useUserInfo";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Search,
  Users,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const JobBoardLanding = () => {
  const router = useRouter();
  const { data: userInfo } = useGetUserInfo();

  useEffect(() => {
    if (userInfo) {
      router.push("/dashboard");
    }
  }, [userInfo, router]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const buttonVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.6,
      },
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const floatingIconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (custom: any) => ({
      opacity: 0.8,
      scale: 1,
      transition: {
        delay: 0.8 + custom * 0.2,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
    float: (custom: any) => ({
      y: [0, -10, 0],
      x: [0, custom * 5, 0],
      transition: {
        y: {
          repeat: Infinity,
          duration: 3 + custom,
          ease: "easeInOut",
        },
        x: {
          repeat: Infinity,
          duration: 5 + custom,
          ease: "easeInOut",
        },
      },
    }),
  };


  return (
    <div className="old:bg-gradient-to-br old:from-indigo-900 old:via-purple-900 old:to-violet-800 h-screen w-full overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(120,90,255,0.2)_0%,rgba(0,0,0,0)_60%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(76,29,149,0.3)_0%,rgba(0,0,0,0)_60%)]"></div> */}

        {/* Floating icons */}
        <motion.div
          className="absolute left-[15%] top-[15%] text-electric-purple/80 opacity-20"
          variants={floatingIconVariants}
          initial="hidden"
          animate={["visible", "float"]}
          custom={1}
        >
          <Briefcase size={48} />
        </motion.div>

        <motion.div
          className="absolute right-[20%] top-[25%] text-electric-purple/60 opacity-20"
          variants={floatingIconVariants}
          initial="hidden"
          animate={["visible", "float"]}
          custom={2}
        >
          <Building2 size={64} />
        </motion.div>

        <motion.div
          className="absolute bottom-[30%] left-[25%] text-electric-purple/40 opacity-20"
          variants={floatingIconVariants}
          initial="hidden"
          animate={["visible", "float"]}
          custom={0}
        >
          <Search size={40} />
        </motion.div>

        <motion.div
          className="absolute bottom-[20%] right-[30%] text-eggplant/60 opacity-20"
          variants={floatingIconVariants}
          initial="hidden"
          animate={["visible", "float"]}
          custom={1.5}
        >
          <Users size={56} />
        </motion.div>

        {/* Decorative circles */}
        <motion.div
          className="absolute right-[10%] top-[10%] h-64 w-64 rounded-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        />

        <motion.div
          className="absolute bottom-[10%] left-[5%] h-80 w-80 rounded-full bg-gradient-to-r from-violet-600/10 to-purple-600/10 blur-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center font-merriweather-sans">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Subtle badge above title */}
          <motion.div
            variants={itemVariants}
            className="mb-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm"
          >
            <span className="text-sm font-medium text-cyan-100">
              Votre carrière commence ici
            </span>
            <ChevronRight className="ml-1 h-4 w-4 text-cyan-100" />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mx-auto mb-4 max-w-3xl text-5xl font-bold md:text-6xl"
          >
            <span className="bg-gradient-to-r from-cyan-100 to-blue-100 bg-clip-text text-transparent">
              Découvrez des centaines d'offres d'emploi,
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mb-6 text-2xl font-semibold text-white/90 md:text-3xl"
          >
            et postulez après inscription
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="mx-auto mb-12 max-w-2xl text-lg text-white/70"
          >
            Rejoignez des milliers de professionnels qui ont trouvé leur emploi
            idéal grâce à notre plateforme.
          </motion.p>

          <motion.div
            variants={buttonVariants}
            className="mx-auto flex w-full max-w-2xl flex-col space-y-3 rounded-full border border-white/20 bg-white/10 p-3 backdrop-blur-md md:flex-row md:space-x-4 md:space-y-0"
          >
            <Link href="/sign?role=recruiter" className="flex-1">
              <motion.button
                className="group flex w-full items-center justify-center space-x-2 rounded-full bg-white px-6 py-4 font-medium text-gray-700"
                whileHover={{
                  backgroundColor: "#f8fafc",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Building2 className="mr-2 h-5 w-5 text-indigo-600 transition-transform group-hover:scale-110" />
                <span>Je suis recruteur</span>
                <ArrowRight className="ml-2 h-4 w-4 text-indigo-600 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </motion.button>
            </Link>

            <Link href="/jobs" className="flex-1">
              <motion.button
                className="group flex w-full items-center justify-center space-x-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 font-medium text-white"
                whileHover={{
                  boxShadow: "0 10px 25px rgba(79, 70, 229, 0.4)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Briefcase className="mr-2 h-5 w-5 text-white transition-transform group-hover:scale-110" />
                <span>Je cherche un emploi</span>
                <ArrowRight className="ml-2 h-4 w-4 text-white opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats section */}
          <motion.div
            variants={itemVariants}
            className="mt-16 flex flex-wrap justify-center gap-8 text-white/80"
          >
            <div className="flex flex-col items-center">
              <span className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-3xl font-bold text-transparent">
                2,500+
              </span>
              <span className="mt-1 text-sm">Offres d'emploi</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-3xl font-bold text-transparent">
                750+
              </span>
              <span className="mt-1 text-sm">Entreprises</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-3xl font-bold text-transparent">
                15,000+
              </span>
              <span className="mt-1 text-sm">Candidats</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default JobBoardLanding;
