export enum IBranchAccessLevel {
  no_access = 0,
  developer = 30,
  maintainer = 40,
  admin = 60
}

export interface IProtectedBranch {
  name: string;
  push_access_levels: IProtectedBranchAccessLevel[];
  merge_access_levels: IProtectedBranchAccessLevel[];
}

export interface IProtectedBranchAccessLevel {
  access_level: IBranchAccessLevel;
  access_level_description: string;
  user_id: any;
  group_id: any;
}

export interface IProtectBranchPayload {
  name: string;
  push_access_level: IBranchAccessLevel;
  merge_access_level: IBranchAccessLevel;
  unprotect_access_level: IBranchAccessLevel;
}

export interface ISettings {
  tokens: { [host: string]: string | false }
}
