// AddressDto
export interface Address {
  street: string;
  city: string;
  postalCode?: string;
  country: string;
}

// DocumentItemDto (with optional files array)
export interface DocumentItem {
  id: string;
  type: string;
  issuedDate?: string;  // ISO date string
  expiryDate?: string;  // ISO date string
  files?: string[];     // Optional array of file URLs or filenames
}

// BusinessDto (array of businesses on PersonDto)
export interface Business {
  id: string;
  name: string;
  industry?: string;
  employeesCount?: number;
}

// PersonDto main interface
export interface Person {
  THINGS: any;
  TYPETH: string;
  _id?: string;  
  IDNUM: string;
  NAME: string;
  FIRSTNAME?: string;
  LASTNAME: string;
  AGETH: string;
  dob?: string;       // ISO date string
  EMAIL?: string;
  PHONE?: string;
  MOTHERID?: string;
  FATHERID?: string;

  // Arrays
  ADDRESS?: Address[];
  documents?: DocumentItem[];
  businesses?: Business[];   // <-- newly added

  // Recursive children for family tree
  CHILDREN?: Person[];

  // UI helper fields (optional)
  IMAGETH?: string;
  EMOJIMETH?: string;
  isPlaceholder?: boolean;
}

