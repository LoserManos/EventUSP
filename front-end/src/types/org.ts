// src/types/org.ts
export type OrgRole = 'admin' | 'poster' | 'member';

export interface Organization {
  id: number;
  name: string;
  description: string;
  picture_profile: string | null;
  creator_id: number;
}

export interface OrganizationCreateDTO {
  name: string;
  description: string;
}

export interface OrganizationUpdateDTO {
  name?: string;
  description?: string;
}

export interface OrgMember {
  user_id: number;
  organization_id: number;
  role: OrgRole;
  status: boolean;
  user?: {
    id: number;
    name: string;
    nickname: string;
    email: string;
    picture_profile: string | null;
  };
}

export interface PaginatedOrgResponse {
  current_page: number;
  limit: number;
  total_records: number;
  total_pages: number;
  data: Organization[];
}