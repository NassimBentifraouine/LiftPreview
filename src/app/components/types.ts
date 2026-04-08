export interface FormSection {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ReactNode;
  subsections: {
    id: string;
    label: string;
    fields: string[];
  }[];
}
