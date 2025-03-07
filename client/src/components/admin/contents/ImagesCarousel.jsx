import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ArrowBackIosNewSharpIcon from '@mui/icons-material/ArrowBackIosNewSharp';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
function ImagesCarousel({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    useEffect(() => {
        const interval = setInterval(nextImage, 3000);
        return () => clearInterval(interval);
    }, [currentIndex]);

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
                            <ArrowForwardIosSharpIcon  />
                        </button>
                    </>}
                </div>
            </div>
            {images.length > 1 && <div className="mt-4 flex gap-2">
                {images.map((image, index) => (
                    <img
                        key={image.imageId}
                        src={`${import.meta.env.VITE_BASE_URL}/media-content/${image.imgUrl}`}
                        alt="thumbnail"
                        className={`w-16 h-16 object-cover cursor-pointer rounded-md ${index === currentIndex ? 'border-2 border-blue-500' : 'opacity-50'}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>}
        </>
    );
}

export default ImagesCarousel;
