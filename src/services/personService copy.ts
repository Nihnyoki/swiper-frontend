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
  IFATH: any;
  IDNUM: string;
  NAME: string;
  LASTNAME: string;
  AGETH: string;
  FIRSTNAME?: string;
  dob?: string;     
  EMAIL?: string;
  PHONE?: string;
  MOTHERID?: string;
  FATHERID?: string;
  FRIENDS?: any;
  MEDIASUM?: number;
  DRINKS?: any;
  ACTIVITIES?: any;
  LOVE?: any;
  _id?: string;  

  // Arrays
  ADDRESS?: Address[];
  documents?: DocumentItem[];
  businesses?: Business[];   // <-- newly added

  // Recursive children for family tree
  FAMILY?: Person[];

  // UI helper fields (optional)
  IMAGETH?: string;
  EMOJIMETH?: string;
  isPlaceholder?: boolean;
}

