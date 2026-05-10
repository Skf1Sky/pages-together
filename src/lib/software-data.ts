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

export const softwares: Software[] = [
  {
    id: "autocad",
    name: "AutoCAD",
    version: "2024.1",
    size: "3.2 GB",
    rating: 4.8,
    reviews: "12K",
    category: "Xây Dựng",
    color: "#E52B50",
    letter: "AC",
    versions: [
      { v: "2024.1", s: "3.2 GB", d: "05/05/2024" },
      { v: "2023.0", s: "3.0 GB", d: "10/04/2023" },
      { v: "2022.1", s: "2.8 GB", d: "15/03/2022" }
    ]
  },
  {
    id: "3dsmax",
    name: "3ds Max",
    version: "2024",
    size: "4.5 GB",
    rating: 4.7,
    reviews: "8.5K",
    category: "Xây Dựng",
    color: "#0076B6",
    letter: "3M",
    versions: [
      { v: "2024", s: "4.5 GB", d: "20/04/2024" },
      { v: "2023", s: "4.2 GB", d: "12/04/2023" }
    ]
  },
  {
    id: "corona",
    name: "Corona Renderer",
    version: "11",
    size: "800 MB",
    rating: 4.9,
    reviews: "4.2K",
    category: "Xây Dựng",
    color: "#F05A28",
    letter: "CR",
    versions: [{ v: "11", s: "800 MB", d: "01/02/2024" }]
  },
  {
    id: "vray",
    name: "V-Ray",
    version: "6.2",
    size: "1.1 GB",
    rating: 4.8,
    reviews: "6.7K",
    category: "Xây Dựng",
    color: "#0099D8",
    letter: "VR",
    versions: [{ v: "6.2", s: "1.1 GB", d: "15/01/2024" }]
  },
  {
    id: "sketchup",
    name: "SketchUp Pro",
    version: "2024",
    size: "950 MB",
    rating: 4.7,
    reviews: "15K",
    category: "Xây Dựng",
    color: "#005F9E",
    letter: "SK",
    versions: [{ v: "2024", s: "950 MB", d: "10/03/2024" }]
  },
  {
    id: "enscape",
    name: "Enscape",
    version: "3.5",
    size: "1.2 GB",
    rating: 4.8,
    reviews: "3.1K",
    category: "Xây Dựng",
    color: "#0B2B36",
    letter: "ES",
    versions: [{ v: "3.5", s: "1.2 GB", d: "05/02/2024" }]
  },
  {
    id: "photoshop",
    name: "Adobe Photoshop",
    version: "2024 25.0",
    size: "2.8 GB",
    rating: 4.9,
    reviews: "45K",
    category: "Đồ Hoạ",
    color: "#31A8FF",
    letter: "PS",
    versions: [
      { v: "2024 25.0", s: "2.8 GB", d: "10/10/2023" },
      { v: "2023 24.0", s: "2.5 GB", d: "15/10/2022" }
    ]
  },
  {
    id: "indesign",
    name: "Adobe InDesign",
    version: "2024 19.0",
    size: "1.5 GB",
    rating: 4.7,
    reviews: "18K",
    category: "Đồ Hoạ",
    color: "#FF3366",
    letter: "ID",
    versions: [{ v: "2024 19.0", s: "1.5 GB", d: "12/10/2023" }]
  },
  {
    id: "foxit-editor",
    name: "Foxit PDF Editor",
    version: "13.0",
    size: "850 MB",
    rating: 4.6,
    reviews: "9.2K",
    category: "Văn Phòng",
    color: "#F26122",
    letter: "FE",
    versions: [{ v: "13.0", s: "850 MB", d: "01/03/2024" }]
  }
];

export const categories = ["Tất cả danh mục", "Xây Dựng", "Đồ Hoạ", "Văn Phòng"];
