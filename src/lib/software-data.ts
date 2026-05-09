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

export const softwares: Software[] = [];

export const categories = ["Tất cả danh mục", "Xây Dựng", "Đồ Hoạ", "Văn Phòng"];
