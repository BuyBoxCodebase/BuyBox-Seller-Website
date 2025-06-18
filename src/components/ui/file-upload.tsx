import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";
import { IconUpload } from "@tabler/icons-react";
import { useDropzone } from "react-dropzone";

export const FileUpload = ({
    onChange,
    baseUrl = "",
    initialImageUrl = null,
}: {
    onChange?: (file: File | null, uploadedUrl?: string) => void;
    baseUrl?: string;
    initialImageUrl?: string | null;
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Set the initial image URL when it's provided
    useEffect(() => {
        if (initialImageUrl) {
            setUploadedUrl(initialImageUrl);
        }
    }, [initialImageUrl]);

    const uploadFile = async (fileToUpload: File) => {
        if (!fileToUpload) return;
        
        // Check if the file is an image (PNG or JPEG)
        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(fileToUpload.type)) {
            setError("Only PNG or JPG/JPEG images are allowed");
            return;
        }
        
        setIsUploading(true);
        setError(null);
        
        try {
            const form = new FormData();
            form.append("files", fileToUpload);
            
            const response = await fetch(`${baseUrl}/category/upload/image`, {
                method: "POST",
                credentials: "include",
                headers: {
                    
                },
                body: form,
            });
            
            if (!response.ok) {
                throw new Error(`Upload failed with status: ${response.status}`);
            }
            
            const data = await response.json();
          //  console.log(data);
            setUploadedUrl(data[0].url);
            onChange && onChange(fileToUpload, data[0].url);
            return data.url;
        } catch (error) {
           // //console.error("Error uploading file:", error);
            setError("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = async (newFiles: File[]) => {
        if (newFiles.length === 0) return;
        
        // Only use the first file
        const newFile = newFiles[0];
        setFile(newFile);
        await uploadFile(newFile);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const { getRootProps, isDragActive } = useDropzone({
        multiple: false,
        noClick: true,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg']
        },
        onDrop: handleFileChange,
        onDropRejected: () => {
            setError("Please upload a PNG or JPG/JPEG image");
        },
    });

    const resetUpload = () => {
        setFile(null);
        setUploadedUrl(null);
        setError(null);
        onChange && onChange(null);
    };

    return (
        <div className="w-full" {...getRootProps()}>
            <div
                onClick={handleClick}
                className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden"
            >
                <input
                    ref={fileInputRef}
                    id="file-upload-handle"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
                    className="hidden"
                />
                
                <div className="flex flex-col items-center justify-center">
                    <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
                        Upload Image
                    </p>
                    <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
                        {isUploading ? "Uploading..." : "Drag or drop a PNG/JPG image or click to upload"}
                    </p>
                    
                    {error && (
                        <p className="mt-2 text-red-500 text-sm">{error}</p>
                    )}
                    
                    <div className="relative w-full mt-10 max-w-xl mx-auto">
                        {uploadedUrl && (
                            <div className="flex flex-col items-center mb-4">
                                <img 
                                    src={uploadedUrl} 
                                    alt="Uploaded image" 
                                    className="max-w-full max-h-48 rounded-md object-contain mb-2"
                                />
                                <Button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        resetUpload();
                                    }}
                                    className="mt-2 px-2 py-1 bg-red-500 text-white rounded-md text-xs"
                                >
                                    Remove
                                </Button>
                            </div>
                        )}
                        
                        {file && !uploadedUrl && (
                            <div
                                className={cn(
                                    "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                                    "shadow-sm"
                                )}
                            >
                                <div className="flex justify-between w-full items-center gap-4">
                                    <p
                                        className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs"
                                    >
                                        {file.name}
                                    </p>
                                    <p
                                        className="rounded-lg px-2 py-1 w-fit flex-shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input"
                                    >
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>

                                <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                                    <p
                                        className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800"
                                    >
                                        {file.type}
                                    </p>

                                    <p>
                                        {isUploading ? (
                                            <span className="text-amber-500">Uploading...</span>
                                        ) : (
                                            `modified ${new Date(file.lastModified).toLocaleDateString()}`
                                        )}
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        {!file && !uploadedUrl && (
                            <div
                                className={cn(
                                    "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md",
                                    "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                                )}
                            >
                                {isDragActive ? (
                                    <p
                                        className="text-neutral-600 flex flex-col items-center"
                                    >
                                        Drop it
                                        <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                    </p>
                                ) : (
                                    <IconUpload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                                )}
                            </div>
                        )}

                        {!file && !uploadedUrl && (
                            <div
                                className="absolute opacity-0 border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md"
                            ></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple Button component if not imported
const Button = ({ 
    children, 
    className, 
    onClick 
}: { 
    children: React.ReactNode, 
    className?: string, 
    onClick?: (e: React.MouseEvent) => void 
}) => {
    return (
        <button 
            onClick={onClick} 
            className={cn("px-4 py-2 rounded-md", className)}
        >
            {children}
        </button>
    );
};