import React from "react";
import { motion as Motion } from "framer-motion";
import { BookOpen, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function PeopleProfileSubjects({ subjects, itemVariants, glassPanel }) {
  const { t } = useTranslation("profile");

  return (
    <Motion.div variants={itemVariants} className={glassPanel + " p-6 md:p-7"}>
      <div className="mb-5 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-Inter font-black uppercase tracking-[0.3em] text-slate-100">
            {t("stats.subjectMastery")}
          </span>
        </div>
        <div className="h-px flex-1 bg-white/15" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {subjects.map((subj) => (
          <Motion.div
            key={subj.name}
            whileHover={{ y: -6, scale: 1.02 }}
            className="group rounded-2xl border border-white/20 bg-white/8 p-5 backdrop-blur-xl transition-all duration-300 hover:border-white/35 hover:bg-white/14 hover:shadow-[0_18px_40px_rgba(14,10,25,0.45)]"
          >
            <div className="mb-4 flex items-center justify-between">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/12 transition-all duration-300 group-hover:scale-110"
                style={{ color: "var(--color-secondary-light)" }}
              >
                <BookOpen size={19} />
              </div>
              <ChevronRight size={16} className="text-slate-300 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
            <h3 className="mb-3 text-sm font-Inter font-bold uppercase tracking-wider text-white">
              {subj.name}
            </h3>
          </Motion.div>
        ))}
      </div>
    </Motion.div>
  );
}
