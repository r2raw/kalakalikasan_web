import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ArrowBackIosNewSharpIcon from '@mui/icons-material/ArrowBackIosNewSharp';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { IconButton } from "@mui/material";
import Modal from "../../models/ui/Modal";
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';
import { useMutation } from "@tanstack/react-query";
import { deleteImage, queryClient } from "../../../util/http";
import SmallDeletableImage from "./SmallDeletableImage";
function EditableImageContent({ images, removeImage }) {

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        if (images.length > 0) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }
    };

    const prevImage = () => {
        if (images.length > 0) {
            setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? images.length - 1 : prevIndex - 1
            );
        }
    };

    useEffect(() => {
        if (images.length > 1) {
            const interval = setInterval(nextImage, 3000);
            return () => clearInterval(interval);
        }
    }, [currentIndex, images.length]);

    // ✅ Fix: Ensure `currentIndex` is valid when removing an image
    const handleRemoveImage = (imageId) => {
        const newImages = images.filter((img) => img.imageId !== imageId);

        // Ensure `currentIndex` does not go out of bounds
        setCurrentIndex((prevIndex) =>
            prevIndex >= newImages.length ? Math.max(0, newImages.length - 1) : prevIndex
        );

        removeImage(imageId); // Call parent function to update state
    };




    return (
        <>
            <div className="relative w-full h-80 overflow-hidden flex flex-col items-center justify-center">
                <div className="relative w-full h-80 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={images[currentIndex].imageId}
                            src={`${import.meta.env.VITE_BASE_URL}/media-content/${images[currentIndex].imgUrl}`}
                            alt="carousel"
                            className="absolute w-full h-80 object-contain"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </AnimatePresence>
                    {images.length > 1 && <>
                        <button
                            className="absolute left-4 flex items-center justify-center bg-accent_color/50 p-2 rounded-full text-white"
                            onClick={prevImage}
                        >
                            <ArrowBackIosNewSharpIcon />
                        </button>
                        <button
                            className="absolute right-4 flex items-center justify-center bg-accent_color/50 p-2 rounded-full text-white"
                            onClick={nextImage}
                        >
                            <ArrowForwardIosSharpIcon />
                        </button>
                    </>}
                </div>
            </div>
            {images.length > 0 && <div className="mt-4 flex gap-2">
                {images.map((image, index) => (
                    <SmallDeletableImage
                        key={image.imageId}
                        removeImage={handleRemoveImage}
                        setCurrentIndex={setCurrentIndex}
                        image={image}
                        index={index}
                        currentIndex={currentIndex} />
                ))}
            </div>}
        </>
    );
}

export default EditableImageContent