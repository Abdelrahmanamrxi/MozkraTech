import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import imageCompression from "browser-image-compression";
import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;
const OUTPUT_SIZE = 512;

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

const getCroppedBlob = async (imageSrc, cropPixels) => {
  const image = await createImage(imageSrc);
  const safeCrop = cropPixels || {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  };

  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to initialize image canvas");

  ctx.drawImage(
    image,
    safeCrop.x,
    safeCrop.y,
    safeCrop.width,
    safeCrop.height,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to process the image"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      0.92,
    );
  });
};

export default function ProfileImageCropper({ imageSrc, onCancel, onConfirm }) {
  const { t } = useTranslation("profile");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleConfirm = async () => {
    setIsProcessing(true);
    setError("");

    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
      const rawFile = new File([blob], `profile-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      const compressed = await imageCompression(rawFile, {
        maxSizeMB: 1,
        maxWidthOrHeight: OUTPUT_SIZE,
        useWebWorker: true,
      });

      if (compressed.size > MAX_PROFILE_IMAGE_BYTES) {
        throw new Error(t("editProfile.photo.tooLarge"));
      }

      onConfirm(compressed);
    } catch (err) {
      setError(err?.message || t("editProfile.photo.processingError"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg rounded-2xl border border-white/15 bg-primary-dark/90 p-5 text-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {t("editProfile.photo.cropTitle")}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-2 hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative h-72 w-full overflow-hidden rounded-xl border border-white/10 bg-black/30">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-white/70">
            {t("editProfile.photo.zoom")}
          </span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="w-full accent-[#B59EF7]"
          />
        </div>

        {error && (
          <p className="mt-3 text-xs text-red-300" role="alert">
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/20"
          >
            {t("editProfile.photo.cancel")}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="flex-1 rounded-lg bg-gradient-to-r from-[#9B7EDE] to-[#B59EF7] px-4 py-2 text-sm font-medium text-white disabled:opacity-70"
          >
            <span className="flex items-center justify-center gap-2">
              <Check size={14} />
              {isProcessing
                ? t("editProfile.photo.processing")
                : t("editProfile.photo.use")}
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
