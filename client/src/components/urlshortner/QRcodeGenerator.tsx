import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import QRCodeStyling, { 
  Options, 
  FileExtension,
  DrawType,
  TypeNumber,
  Mode,
  ErrorCorrectionLevel,
  DotType,
  CornerSquareType,
  CornerDotType
} from "qr-code-styling";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { isAxiosError } from "axios";
import axiosInstance, { ApiResponse } from "@/api/axiosInstance";
import { ApiResponseCreateLink } from "@/Types";
import ToastFn from "../Toaster";
import { motion } from "framer-motion";
import { BsQrCodeScan, BsImage } from "react-icons/bs";
import { FaDownload, FaPalette } from "react-icons/fa6";

const QRcodeGenerator = () => {
  const qrRef = useRef<QRCodeStyling | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const themeColors = [
    { 
      name: "Rose", 
      gradient: { from: "#f43f5e", to: "#fb7185" },
      color: "#f43f5e"
    },
    { 
      name: "Blue", 
      gradient: { from: "#3b82f6", to: "#60a5fa" },
      color: "#3b82f6"
    },
    { 
      name: "Purple", 
      gradient: { from: "#8b5cf6", to: "#a78bfa" },
      color: "#8b5cf6"
    },
    { 
      name: "Emerald", 
      gradient: { from: "#10b981", to: "#34d399" },
      color: "#10b981"
    },
    { 
      name: "Amber", 
      gradient: { from: "#f59e0b", to: "#fbbf24" },
      color: "#f59e0b"
    },
    { 
      name: "Red", 
      gradient: { from: "#ef4444", to: "#f87171" },
      color: "#ef4444"
    },
  ];

  const defaultOptions: Options = {
    width: 300,
    height: 300,
    type: 'svg' as DrawType,
    data: 'https://yatirly.yashchopra.tech/',
    image: '',
    margin: 10,
    qrOptions: {
      typeNumber: 0 as TypeNumber,
      mode: 'Byte' as Mode,
      errorCorrectionLevel: 'H' as ErrorCorrectionLevel
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.4,
      margin: 20,
      crossOrigin: 'anonymous',
    },
    dotsOptions: {
      color: themeColors[0].color,
      type: 'rounded' as DotType
    },
    backgroundOptions: {
      color: 'transparent',
    },
    cornersSquareOptions: {
      color: themeColors[0].color,
      type: 'extra-rounded' as CornerSquareType,
    },
    cornersDotOptions: {
      color: themeColors[0].color,
      type: 'dot' as CornerDotType,
    }
  };

  const [options, setOptions] = useState<Options>(defaultOptions);
  const [fileExt, setFileExt] = useState<FileExtension>("svg");
  const [inputValue, setInputValue] = useState<string>('https://yatirly.yashchopra.tech/');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize QR Code
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // Create new instance with non-empty data
      const initialOptions = {
        ...defaultOptions,
        data: 'https://yatirly.yashchopra.tech/'
      };
      qrRef.current = new QRCodeStyling(initialOptions);
      
      // Clear container and append
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        qrRef.current.append(containerRef.current);
      }
    } catch (error) {
      console.error('Error initializing QR code:', error);
    }

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []); // Empty dependency array to run only once

  // Update QR Code when options change
  useEffect(() => {
    if (!qrRef.current || !options.data) return;

    try {
      qrRef.current.update(options);
    } catch (error) {
      console.error('Error updating QR code:', error);
    }
  }, [options]);

  const onDataChange = (data: string) => {
    setOptions(prevOptions => ({
      ...prevOptions,
      data
    }));
  };

  const onExtensionChange = (event: FileExtension) => {
    setFileExt(event);
  };

  const onDownloadClick = () => {
    if (!qrRef.current || !options.data) {
      ToastFn("error", "Error", "Please generate a QR code first");
      return;
    }
    
    try {
      qrRef.current.download({
        extension: fileExt,
        name: 'qr-code'
      });
    } catch (error) {
      console.error('Error downloading QR code:', error);
      ToastFn("error", "Error", "Failed to download QR code");
    }
  };

  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      ToastFn("error", "Error", "Please enter a URL");
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post<ApiResponse<ApiResponseCreateLink>>(
        "/api/v1/urls/create",
        {
          longUrl: inputValue,
          isQR: true,
        }
      );
      
      if (!data.success) {
        ToastFn("error", "Failed", data.message);
        return;
      }

      const shortURl = `${import.meta.env.VITE_FRONTEND_URL}/${data.data.ShortURL}`;
      onDataChange(shortURl);
      ToastFn("success", "Success", "QR code generated successfully");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        ToastFn("error", "Error", error.response?.data.message || "Something went wrong");
      } else {
        ToastFn("error", "Error", "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onColorChange = (value: string) => {
    const selectedColor = themeColors.find(color => color.name === value)?.color || themeColors[0].color;
    setOptions(prevOptions => ({
      ...prevOptions,
      dotsOptions: { 
        ...prevOptions.dotsOptions, 
        color: selectedColor
      },
      cornersSquareOptions: {
        ...prevOptions.cornersSquareOptions,
        color: selectedColor
      },
      cornersDotOptions: {
        ...prevOptions.cornersDotOptions,
        color: selectedColor
      }
    }));
  };

  const HandleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      ToastFn("error", "Error", "Please upload an image file");
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      ToastFn("error", "Error", "Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setOptions(prevOptions => ({
          ...prevOptions,
          image: result
        }));
      }
    };
    reader.onerror = () => {
      ToastFn("error", "Error", "Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-theme-primary/20 mb-4">
          <BsQrCodeScan className="w-8 h-8 text-theme-primary" />
        </div>
        <h2 className="text-2xl font-bold theme-text-gradient mb-2">
          Create Custom QR Codes
        </h2>
        <p className="text-theme-primary/60">
          Generate unique QR codes with your branding and style
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <form onSubmit={HandleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-theme-primary/60 mb-2 block">
                Enter your URL
              </label>
              <Input
                type="text"
                placeholder="Enter your long URL"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                required
                className="h-12 border-[var(--input-border)] rounded-xl focus:ring-2 focus:ring-[var(--theme-primary)]/30"
              />
            </div>

            <Button
              className="w-full h-12 rounded-xl theme-gradient hover:opacity-90 text-white transition-all duration-300"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                "Generate QR Code"
              )}
            </Button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-theme-primary/60 flex items-center gap-2">
                <BsImage className="w-4 h-4" />
                Add Logo (Optional)
              </label>
              <Input
                type="file"
                onChange={HandleImageUpload}
                accept="image/*"
                className="h-12 file-input border-[var(--input-border)] rounded-xl focus:ring-2 focus:ring-[var(--theme-primary)]/30"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-theme-primary/60 flex items-center gap-2">
                <FaPalette className="w-4 h-4" />
                QR Code Style
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <Select 
                    onValueChange={onColorChange}
                    defaultValue={themeColors[0].name}
                  >
                    <SelectTrigger className="h-12 border-[var(--input-border)] rounded-xl focus:ring-2 focus:ring-[var(--theme-primary)]/30">
                      <div className="flex items-center gap-2">
                       
                        <SelectValue placeholder="Choose color" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {themeColors.map((color) => (
                        <SelectItem 
                          key={color.name} 
                          value={color.name}
                          className="flex items-center gap-2"
                        >
                          <div 
                            className="w-16 h-4 rounded-full border border-[var(--input-border)]" 
                            style={{ 
                              background: `linear-gradient(to right, ${color.gradient.from}, ${color.gradient.to})`,
                            }}
                          />
                          <span className="ml-2">{color.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select onValueChange={onExtensionChange} defaultValue={fileExt}>
                    <SelectTrigger className="h-12 border-[var(--input-border)] rounded-xl focus:ring-2 focus:ring-[var(--theme-primary)]/30">
                      <SelectValue placeholder="File type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="svg">SVG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="webp">WEBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={onDownloadClick}
                  variant="outline"
                  className="h-12 px-6 rounded-xl border-theme-primary/30 hover:bg-theme-primary/10 text-theme-primary transition-all duration-300"
                >
                  <FaDownload className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-theme-primary/5 to-theme-primary/5 rounded-xl" />
          <div className="relative p-6 flex items-center justify-center min-h-[400px] rounded-xl border border-border/30 bg-card/30 backdrop-blur-sm">
            <div ref={containerRef} className="qr-code-container" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default QRcodeGenerator;
