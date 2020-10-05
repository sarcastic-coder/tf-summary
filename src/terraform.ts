export namespace Terraform {
  type ResourceMode = 'managed' | 'data';

  export type Value = {
    outputs: {
      [key: string]: {
        value: string;
        sensitive: boolean;
      };
    };

    root_module: RootModule;
  };

  export type Plan = {
    format_version: string;
    prior_state: {};
    configuration: {};
    planned_values: Value;
    proposed_unknown: Value;
    variables: {};
    resource_changes: ResourceChange[];
    output_changes: {};
  };

  export type ChangeAction = (
    | ['no-op']
    | ['create']
    | ['read']
    | ['update']
    | ['delete', 'create']
    | ['create', 'delete']
    | ['delete']
  );

  export type Change = {
    actions: ChangeAction;

    before: null | Record<string, any>;
    after: null | Record<string, any>;
    after_unknown: null | Record<string, any>;
  };

  export type ResourceChange = {
    address: string;
    module_address?: string;
    mode: ResourceMode;
    type: string;
    name: string;
    index: number;
    deposed?: string;
    change: Change;
  };

  export type Resource = {
    address: string;
    mode: ResourceMode;
    type: string;
    name: string;
    index: number;
    provider_name: string;
    schema_version: number;
    values: Record<string, any>;
  };

  export type RootModule = {
    resources: Resource[];
    child_modules: ChildModule[];
  };

  export type ChildModule = RootModule & {
    address: string;
  };
}