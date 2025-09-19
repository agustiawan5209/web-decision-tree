import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    role: string;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    flash: {
        success?: string;
        error?: string;
    }
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    nik: string;
    name: string;
    email: string;
    avatar?: string;
    alamat?: string;
    nohp?: string;
    jenis_kelamin?: string;
    tempat_lahir?: string;
    tgl_lahir?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}


export interface KriteriaTypes {
    id: number;
    nama: string;
    deskripsi: string;
}
export interface LabelTypes {
    id: number;
    nama: string;
    deskripsi: string;
}
export interface LabelSayuranTypes {
    id: number;
    label_id: number;
    sayuran: string;
    porsi: string;
    tekstur: string;
    frekuensi: string;
    label: LabelTypes;
}

export interface GejalaTypes {
    id: number;
    nama: string;
    deskripsi: string;
}
export interface JenisTanamanTypes {
    id: number;
    nama: string;
    deskripsi: string;
}


export interface DatasetTypes {
    id: number;
    label: string;
    data: string[];
    created_at?: string;
    detail: DetailDatasetTypes[];
}

export interface DetailDatasetTypes {
    id: number;
    kriteria_id: number;
    dataset_id: number;
    nilai: string;
    kriteria: KriteriaTypes;
}
export interface DetailPemeriksaanTypes {
    id: number;
    kriteria_id: number;
    pemeriksaan_id: number;
    nilai: string;
    kriteria: KriteriaTypes;
}
export interface BalitaTypes {
    id: number;
    nik: string;
    nama: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    orang_tua_id: string;
    orangtua: User;
}


interface PredictionResult {
    prediction: number | number[] | null;
    label: string | string[] | null;
    rekomendasi: string | null;
    error: string | null;
}

interface DatasetSayuranTypes {
    id: number;
    nama_sayuran: string;
    deskripsi: string;
    manfaat: string;
    nutrisi: string;
    status: string;
    gejala: string;
}

export interface PemeriksaanTypes {
    id: number;
    balita_id: number;
    rme: string;
    nik: string;
    data_balita: string[];
    balita: BalitaTypes;
    tgl_pemeriksaan: string;
    data_pemeriksaan: string;
    gejala: string;
    label: string;
    rekomendasi: DatasetSayuranTypes[];
    detailpemeriksaan: DetailPemeriksaanTypes[];
}
