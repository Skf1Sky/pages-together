export type SoftwareVersion = {
  v: string; // version string
  s: string; // size string
  d: string; // date string
};

export type Software = {
  id: string;
  name: string;
  version: string;
  size: string;
  rating: number;
  reviews: string;
  category: string;
  color: string;
  letter: string;
  publisher?: string;
  downloads?: string;
  description?: string;
  versions: SoftwareVersion[];
  features?: string[];
  requirements?: {
    cpu: string;
    ram: string;
    disk: string;
    os?: string;
  };
  screenshots?: string[];
  changelog?: string;
};

// Dữ liệu đã được chuyển sang Supabase. Mảng này được để trống để sẵn sàng nhận dữ liệu thật.
export const softwares: Software[] = [];

export const categories = ["Tất cả danh mục", "Xây Dựng", "Đồ Hoạ", "Văn Phòng"];
