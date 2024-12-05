"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon, ChevronLeft, ChevronRight } from "lucide-react";

const IMAGES_PER_PAGE = 10;
const TOTAL_IMAGES = 50;

export default function ImageGallery() {
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpToImage, setJumpToImage] = useState("");
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const indexOfLastImage = currentPage * IMAGES_PER_PAGE;
  const indexOfFirstImage = indexOfLastImage - IMAGES_PER_PAGE;

  const totalPages = Math.ceil(TOTAL_IMAGES / IMAGES_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setLoadedImages({});
  };

  const handleJumpToImage = () => {
    const imageNumber = parseInt(jumpToImage);
    if (imageNumber >= 1 && imageNumber <= TOTAL_IMAGES) {
      const pageNumber = Math.ceil(imageNumber / IMAGES_PER_PAGE);
      setCurrentPage(pageNumber);
      setJumpToImage("");
      setLoadedImages({});
    } else {
      console.log("====================================");
      console.log("tidak ada");
      console.log("====================================");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const currentImages = Array.from(
    { length: IMAGES_PER_PAGE },
    (_, i) => indexOfFirstImage + i + 1
  ).filter((num) => num <= TOTAL_IMAGES);

  const handlePreviousImage = useCallback(() => {
    if (activeImage && activeImage > 1) {
      setActiveImage(activeImage - 1);
    } else {
      setActiveImage(TOTAL_IMAGES);
    }
  }, [activeImage]);

  const handleNextImage = useCallback(() => {
    if (activeImage && activeImage < TOTAL_IMAGES) {
      setActiveImage(activeImage + 1);
    } else {
      setActiveImage(1);
    }
  }, [activeImage]);

  const handleImageLoad = (imageNumber: number) => {
    setLoadedImages((prev) => ({ ...prev, [imageNumber]: true }));
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isDialogOpen) {
        if (event.key === "ArrowLeft") {
          handlePreviousImage();
        } else if (event.key === "ArrowRight") {
          handleNextImage();
        }
      }
    },
    [isDialogOpen, handlePreviousImage, handleNextImage]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-primary">
        Kuis UAS Jarkom
      </h1>
      <p className="mt-8 text-center opacity-60">
        Gunakan laptop untuk pengalaman terbaik
      </p>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex space-x-2 w-full sm:w-auto">
          <Input
            placeholder="Cari nomor..."
            value={jumpToImage}
            onChange={(e) => setJumpToImage(e.target.value)}
            className="w-full sm:w-40"
            min={1}
            max={TOTAL_IMAGES}
          />
          <Button onClick={handleJumpToImage} variant="default">
            Go
          </Button>
        </div>
        <Button
          onClick={toggleTheme}
          size="icon"
          className="w-10 h-10 rounded-full"
        >
          {theme === "dark" ? (
            <SunIcon className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {currentImages.map((imageNumber) => (
          <Card key={imageNumber} className="overflow-hidden group">
            <CardContent className="p-0">
              <Dialog
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (open) setActiveImage(imageNumber);
                  else setActiveImage(null);
                }}
              >
                <DialogTrigger asChild>
                  <div className="cursor-pointer relative aspect-square overflow-hidden">
                    {!loadedImages[imageNumber] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <Skeleton className="w-16 h-16 rounded-full border-x-2 border-y-2 border-y-slate-200 border-x-neutral-800 animate-spin" />
                      </div>
                    )}
                    <Image
                      src={`/soal/${imageNumber}.png`}
                      alt={`Soal ${imageNumber}`}
                      fill
                      className={`object-cover transition-all duration-300 group-hover:scale-110 ${
                        loadedImages[imageNumber] ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => handleImageLoad(imageNumber)}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-sm font-medium">
                      Soal {imageNumber}
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-1">
                  <div className="relative aspect-video">
                    {activeImage && (
                      <>
                        {!loadedImages[activeImage] && (
                          <div className="absolute inset-0 flex items-center justify-center bg-muted">
                            <Skeleton className="w-24 h-24 rounded-full border-x-2 border-y-2 border-y-slate-200 border-x-neutral-800 animate-spin" />
                          </div>
                        )}
                        <Image
                          src={`/soal/${activeImage}.png`}
                          alt={`Soal ${activeImage}`}
                          fill
                          className={`object-contain rounded-md ${
                            loadedImages[activeImage]
                              ? "opacity-100"
                              : "opacity-0"
                          } transition-opacity duration-300`}
                          onLoad={() => handleImageLoad(activeImage)}
                        />
                      </>
                    )}
                    <Button
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                      onClick={handlePreviousImage}
                      variant="secondary"
                      size="icon"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={handleNextImage}
                      variant="secondary"
                      size="icon"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Soal {activeImage} dari {TOTAL_IMAGES}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={() => handlePageChange(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
