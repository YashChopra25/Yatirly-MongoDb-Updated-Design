import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import QRCodeStyling, { Options, FileExtension } from "qr-code-styling";
import { isAxiosError } from "axios";
import axiosInstance, { ApiResponse } from "@/api/axiosInstance";
import { ApiResponseCreateLink } from "@/Types";
import ToastFn from "../Toaster";
import { Download, ImagePlus, QrCode, X } from "lucide-react";
import { buildQrOptions, qrFormats, qrPalette } from "@/config/qr";
import Spinner from "@/components/common/Spinner";
import { cn } from "@/lib/utils";

// The QR preview starts out pointing at this app's own URL, taken from the environment.
const DEFAULT_QR_DATA: string = import.meta.env.VITE_FRONTEND_URL ?? "";

const QRcodeGenerator = () => {
  const qrRef = useRef<QRCodeStyling | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoName, setLogoName] = useState<string>("");
  
  const themeColors = qrPalette;
  const defaultOptions: Options = buildQrOptions(DEFAULT_QR_DATA);

  const [options, setOptions] = useState<Options>(defaultOptions);
  const [fileExt, setFileExt] = useState<FileExtension>("svg");
  const [inputValue, setInputValue] = useState<string>(DEFAULT_QR_DATA);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>(themeColors[0].name);

  // Initialize QR Code
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // Create new instance with non-empty data
      const initialOptions = {
        ...defaultOptions,
        data: DEFAULT_QR_DATA
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
    setSelectedColor(value);
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
        setLogoName(file.name);
      }
    };
    reader.onerror = () => {
      ToastFn("error", "Error", "Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setOptions((prevOptions) => ({ ...prevOptions, image: "" }));
    setLogoName("");
    // Clear the input so picking the same file again still fires onChange.
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const formats = qrFormats;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      {/* Controls */}
      <div className="space-y-7">
        <div className="space-y-2">
          <h2 className="headline text-3xl sm:text-4xl">Design a QR code.</h2>
          <p className="text-muted-foreground">Generate a tracked short link and wrap it in your own style.</p>
        </div>

        <form onSubmit={HandleSubmit} className="space-y-3">
          <label htmlFor="qr-url" className="eyebrow">
            01 · Destination
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="qr-url"
              type="text"
              placeholder="Enter your long URL"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              required
              className="field font-mono text-[13px]"
            />
            <button className="btn-primary h-12 px-6" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner /> Generating…
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4" /> Generate
                </>
              )}
            </button>
          </div>
        </form>

        <div className="space-y-3">
          <p className="eyebrow">02 · Palette</p>
          <div className="flex flex-wrap gap-2">
            {themeColors.map((color) => {
              const selected = selectedColor === color.name;
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => onColorChange(color.name)}
                  aria-pressed={selected}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all",
                    selected
                      ? "border-theme-primary/60 bg-theme-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:border-theme-primary/30 hover:text-foreground"
                  )}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full ring-1 ring-border"
                    style={{ background: `linear-gradient(135deg, ${color.gradient.from}, ${color.gradient.to})` }}
                  />
                  {color.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <label htmlFor="qr-logo" className="eyebrow">
            <ImagePlus className="h-3.5 w-3.5" /> 03 · Logo <span className="normal-case tracking-normal">(optional, max 2MB)</span>
          </label>
          {options.image ? (
            <div className="field flex items-center gap-3 py-2">
              <img src={options.image} alt="" className="h-8 w-8 rounded-md border border-border bg-white object-contain" />
              <span className="min-w-0 flex-1 truncate text-sm">{logoName || "Logo added"}</span>
              <button type="button" onClick={removeLogo} className="btn-danger h-8 px-3 text-xs">
                <X className="h-3.5 w-3.5" /> Remove
              </button>
            </div>
          ) : (
            <input
              ref={logoInputRef}
              id="qr-logo"
              type="file"
              onChange={HandleImageUpload}
              accept="image/*"
              className="file-input field flex items-center py-2 text-muted-foreground"
            />
          )}
        </div>

        <div className="space-y-3">
          <p className="eyebrow">04 · Export</p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="segmented">
              {formats.map((ext) => (
                <button
                  key={ext}
                  type="button"
                  onClick={() => onExtensionChange(ext)}
                  className={cn("segment font-mono text-xs uppercase", fileExt === ext && "bg-accent text-foreground")}
                >
                  {ext}
                </button>
              ))}
            </div>
            <button type="button" onClick={onDownloadClick} className="btn-ghost h-11">
              <Download className="h-4 w-4" /> Download
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="relative">
        <div className="panel-inset relative flex h-full min-h-[380px] flex-col items-center justify-center gap-5 p-6">
          {/* Corner brackets */}
          {["left-3 top-3 border-l-2 border-t-2", "right-3 top-3 border-r-2 border-t-2", "bottom-3 left-3 border-b-2 border-l-2", "bottom-3 right-3 border-b-2 border-r-2"].map((pos) => (
            <span key={pos} className={cn("absolute h-6 w-6 rounded-[4px] border-theme-primary/70", pos)} />
          ))}
          <div className="relative overflow-hidden rounded-2xl bg-white p-3 shadow-[0_20px_60px_-20px_rgb(var(--tp)/0.5)]">
            <div ref={containerRef} className="qr-code-container [&_svg]:h-auto [&_svg]:max-w-full" />
            <span className="absolute inset-x-0 h-0.5 animate-scan bg-theme-primary shadow-[0_0_14px_rgb(var(--tp))]" />
          </div>
          <div className="w-full text-center">
            <p className="eyebrow justify-center">Encoded</p>
            <p className="num mt-1 truncate text-sm" title={options.data}>
              {options.data?.replace(/^https?:\/\//, "")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRcodeGenerator;
