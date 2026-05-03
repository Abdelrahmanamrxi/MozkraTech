/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Calendar, Edit2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const infoFields = [
  { key: "email", icon: Mail, labelKey: "personalInfo.fields.email" },
  { key: "phone", icon: Phone, labelKey: "personalInfo.fields.phone" },
  { key: "location", icon: MapPin, labelKey: "personalInfo.fields.location" },
  {
    key: "memberSince",
    icon: Calendar,
    labelKey: "personalInfo.fields.memberSince",
  },
];

function PersonalInformation({ mockProfileData }) {
  const { user } = mockProfileData;
  const { t } = useTranslation("profile");

  return (
    <div className="bg-[#3D3555]/60 border-t border-[#9B7EDE]/20 rounded-[24px] p-6 font-Inter">
      <div className="flex justify-between items-center mb-5">
        <p className="text-lg font-semibold text-white">
          {t("personalInfo.title")}
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 text-xs text-[#B8A7E5] hover:text-white transition-colors cursor-pointer"
        >
          <Edit2 size={12} /> {t("personalInfo.editButton")}
        </motion.button>
      </div>

      <div className="flex flex-col gap-3">
        {infoFields.map(({ key, icon: Icon, labelKey }) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4 bg-[#2F2844]/80 border border-white/10 rounded-[16px] px-4 py-3.5"
          >
            <div className="w-9 h-9 rounded-full bg-[#9B7EDE]/20 border border-[#9B7EDE]/30 flex items-center justify-center flex-shrink-0">
              <Icon size={15} className="text-[#B8A7E5]" />
            </div>
            <div>
              <p className="text-[10px] text-[#B8A7E5]/60 font-medium">
                {t(labelKey)}
              </p>
              <p className="text-sm font-semibold text-white mt-0.5">
                {user[key]}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default PersonalInformation;
