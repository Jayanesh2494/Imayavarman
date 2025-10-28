export interface Student {
  _id: string;
  name: string;
  age: number;
  phoneNumber?: string;
  parentPhone?: string;
  email?: string;
  address?: string;
  profileImage?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
  belt?: string;
  achievements?: string[];
  faceEmbedding?: number[];
}

export interface CreateStudentData {
  name: string;
  age: number;
  phoneNumber?: string;
  parentPhone?: string;
  email?: string;
  address?: string;
  faceImage?: string;
}
