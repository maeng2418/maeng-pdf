export interface ConversionOptions {
  quality: number[];
  pageSize: 'a4' | 'a3' | 'letter' | 'legal';
  orientation: 'portrait' | 'landscape';
  password: boolean;
  passwordValue: string;
  outputFormat?: string;
  pageRange?: string;
  maintainLayout?: boolean;
}

export const defaultConversionOptions: ConversionOptions = {
  quality: [80],
  pageSize: 'a4',
  orientation: 'portrait',
  password: false,
  passwordValue: '',
  outputFormat: '',
  pageRange: 'all',
  maintainLayout: true,
};