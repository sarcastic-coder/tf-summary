import React from 'react';
import { ModuleRepresentation } from './Module';
import { Change, ChangeRepresentation } from './Change';
import { Col, Row, ButtonGroup, Button } from 'reactstrap';

export type ValueRepresentation = {
  outputs: {
    [key: string]: {
      value: string;
      sensitive: boolean;
    };
  };

  root_module: ModuleRepresentation;
};

export type ResourceChange = {
  address: string;
  module_address?: string;
  mode: 'managed' | 'data';
  type: string;
  name: string;
  index: number;
  deposed?: string;
  change: ChangeRepresentation;
};

export type PlanRepresentation = {
  format_version: string;
  prior_state: {};
  configuration: {};
  planned_values: ValueRepresentation;
  proposed_unknown: ValueRepresentation;
  variables: {};
  resource_changes: ResourceChange[];
  output_changes: {};
};

type PlanProps = {
  representation: PlanRepresentation;
};

export type ChangeFilterAction = (
  | 'no-op'
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
);

export type PlanFilter = {
  actions: ChangeFilterAction[];
  type?: string[];
};

export const Plan: React.FunctionComponent<PlanProps> = (props) => {
  const [ filter, setFilter ] = React.useState<PlanFilter>({
    actions: ['update', 'delete', 'create', 'read']
  });

  const toggleActionFilter = (filterAction: ChangeFilterAction) => {
    const filteredActions = filter.actions.includes(filterAction)
      ? filter.actions.filter((action) => { return action !== filterAction; })
      : [...filter.actions, filterAction];

    setFilter({
      ...filter,
      actions: filteredActions,
    })
  }

  return <>
    <Row>
      <Col>
        <h3>Filters</h3>
      </Col>
    </Row>
    <Row>
      <Col>
        <ButtonGroup>
          <Button active={filter.actions.includes('no-op')} onClick={() => toggleActionFilter('no-op')}>No Change</Button>
          <Button active={filter.actions.includes('read')} onClick={() => toggleActionFilter('read')}>Read</Button>
          <Button active={filter.actions.includes('create')} onClick={() => toggleActionFilter('create')}>Create</Button>
          <Button active={filter.actions.includes('update')} onClick={() => toggleActionFilter('update')}>Update</Button>
          <Button active={filter.actions.includes('delete')} onClick={() => toggleActionFilter('delete')}>Delete</Button>
        </ButtonGroup>
      </Col>
    </Row>
    <Row className={"mt-3"}>
      <Col>
        <h3>Changes</h3>
      </Col>
    </Row>
    <Row>
      <Col>
        {props.representation.resource_changes.map((change, ix) => {
          return <Change key={ix} resourceChange={change} filter={filter} />;
        })}
      </Col>
    </Row>
  </>;
};
