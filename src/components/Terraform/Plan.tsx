import React from 'react';
import { Alert, Col, CustomInput, FormGroup, Input, Label, Row } from 'reactstrap';
import { Terraform } from '../../terraform';
import { Change } from './Change';

type PlanProps = {
  representation: Terraform.Plan;
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
  address: string;
  type?: string[];
};

export const Plan: React.FunctionComponent<PlanProps> = (props) => {
  const [ filter, setFilter ] = React.useState<PlanFilter>({
    actions: ['update', 'delete', 'create', 'read'],
    address: '',
  });

  const toggleActionFilter = (filterAction: ChangeFilterAction) => {
    const filteredActions = filter.actions.includes(filterAction)
      ? filter.actions.filter((action) => { return action !== filterAction; })
      : [...filter.actions, filterAction];

    setFilter({
      ...filter,
      actions: filteredActions,
    })
  };

  const handleAddressFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({
      ...filter,
      address: event.target.value,
    })
  };

  const filteredChanges = props.representation.resource_changes.filter((resourceChange) => {
    return [
      // Name
      () => {
        return filter.address === '' || resourceChange.address.includes(filter.address.toLowerCase());
      },
      // Operation
      () => {
        return filter.actions.some((a: ChangeFilterAction) => {
          // @ts-ignore
          return resourceChange.change.actions.includes(a);
        });
      },
    ].every((filter) => {
      return filter() === true;
    });
  });

  return <>
    <Row>
      <Col>
        <h3>Filters</h3>
      </Col>
    </Row>
    <Row>
      <Col>
        <FormGroup>
          <Label>Name</Label>
          <Input type={"search"} value={filter.address} onChange={handleAddressFilterChange} />
        </FormGroup>
      </Col>
    </Row>
    <Row>
      <Col>
        <h5>Operation</h5>
        <Row>
          <Col>
            <CustomInput type="switch" id={"filterNoOp"} checked={filter.actions.includes('no-op')} label={"No Change"} onChange={() => toggleActionFilter('no-op')}/>
          </Col>
          <Col>
            <CustomInput type="switch" id={"filterRead"} checked={filter.actions.includes('read')} label={"Read"} onChange={() => toggleActionFilter('read')}/>
          </Col>
          <Col>
            <CustomInput type="switch" id={"filterCreate"} checked={filter.actions.includes('create')} label={"Create"} onChange={() => toggleActionFilter('create')}/>
          </Col>
          <Col>
            <CustomInput type="switch" id={"filterUpdate"} checked={filter.actions.includes('update')} label={"Update"} onChange={() => toggleActionFilter('update')}/>
          </Col>
          <Col>
            <CustomInput type="switch" id={"filterdelete"} checked={filter.actions.includes('delete')} label={"Delete"} onChange={() => toggleActionFilter('delete')}/>
          </Col>
        </Row>
      </Col>
    </Row>
    <Row className={"mt-3"}>
      <Col>
        <h3>Changes</h3>
      </Col>
    </Row>
    <Row>
      <Col>
        {filteredChanges.length === 0 && <>
          <Alert color={"info"}>
            <p className={"mb-0"}>There is nothing to show</p>
          </Alert>
        </>}
        {filteredChanges.map((change, ix) => {
          return <Change key={ix} resourceChange={change} />;
        })}
      </Col>
    </Row>
  </>;
};
