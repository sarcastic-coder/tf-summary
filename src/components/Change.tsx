import React from 'react';
import { Row, Col, Collapse, Alert } from 'reactstrap';
import { ChangeFilterAction, PlanFilter, ResourceChange, ValueRepresentation } from './Plan';
import { Module } from './Module';

export type ChangeAction = (
  | ['no-op']
  | ['create']
  | ['read']
  | ['update']
  | ['delete', 'create']
  | ['create', 'delete']
  | ['delete']
);

export type ChangeRepresentation = {
  actions: ChangeAction;

  before: null | Record<string, any>;
  after: null | Record<string, any>;
  after_unknown: null | Record<string, any>;
};

type ChangeMapValue = {
  address: string;
  changed: boolean;
  after_unknown: boolean;
  before: null | string | Record<string, any> | any[];
  after: null | string | Record<string, any> | any[];
};

type ChangeMap = {
  [key: string]: ChangeMapValue;
};

const getChangeColor = (actions: string[]): string => {
  if (actions.length === 1) {
    const action = actions.shift();

    switch (action) {
      case 'no-op':
        return 'secondary';
      case 'update':
        return 'warning';
      case 'delete':
        return 'danger';
      default:
        return 'info';
    }
  }

  if (actions === ['create', 'delete'] || actions === ['delete', 'create']) {
    return 'danger';
  }

  return 'info';
}

const getChangeLabel = (actions: string[]) => {
  if (actions.length === 1) {
    const action = actions.shift();

    switch (action) {
      case 'no-op':
        return 'No change';
      case 'update':
        return 'Update in place';
      case 'delete':
        return 'Delete';
      default:
        return action;
    }
  }

  if (actions === ['create', 'delete']) {
    return 'Create new before delete old';
  }

  if (actions === ['delete', 'create']) {
    return 'Delete old before create new';
  }

  return 'Unknown';
}

const findChange = (a: unknown, b: unknown): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return JSON.stringify(a) !== JSON.stringify(b);
  }

  if (typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a) !== JSON.stringify(b);
  }

  return a !== b;
};

const ChangeRow: React.FunctionComponent<ChangeMapValue> = (props: ChangeMapValue) => {
  const { address, before, after, changed, after_unknown } = props;

  if (!changed) {
    return <Row>
      <Col>
        <h5>{address}</h5>
      </Col>
      <Col>
        No Change
      </Col>
    </Row>;
  }

  return <Row>
    <Col>
      <Row>
        <Col>
          <h5>{address}</h5>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <pre>{JSON.stringify(before, null, 2)}</pre>
        </Col>
        <Col md={6}>
          {after_unknown
            ? 'Known after apply'
            : (<pre>{JSON.stringify(after, null, 2)}</pre>)
          }
        </Col>
      </Row>
    </Col>
  </Row>;
};

type ChangeProps = {
  resourceChange: ResourceChange;
  filter: PlanFilter;
};

export const Change: React.FunctionComponent<ChangeProps> = (props) => {
  const { filter, resourceChange } = props;
  const [showDetails, setShowDetails] = React.useState(false);

  const showChange = filter.actions.some((a: ChangeFilterAction) => {
    // @ts-ignore
    return resourceChange.change.actions.includes(a);
  });

  if (!showChange) {
    return null;
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  console.log(resourceChange.change.after_unknown);

  const changeMap = Object.entries(resourceChange.change.before ?? {})
    .reduce(
      (combined: ChangeMap, [key, value]) => {
        const changed = combined[key] === undefined
          ? true
          : findChange(value, combined[key].after)
        return {
          ...combined,
          [key]: {
            ...combined[key],
            address: key,
            before: value,
            changed,
          }
        }
      },
      Object.entries(resourceChange.change.after ?? {})
        .reduce(
          (combined: ChangeMap, [key, value]) => {
            return {
              ...combined,
              [key]: {
                ...combined[key],
                changed: false,
                address: key,
                after: value,
              }
            };
          },
          Object.entries(resourceChange.change.after_unknown ?? {}).reduce(
            (combined: ChangeMap, [key, value]) => {
              return {
                ...combined,
                [key]: {
                  ...combined[key],
                  address: key,
                  before: null,
                  after: null,
                  after_unknown: value === true,
                },
              };
            },
            {}
          )
        )
    );

  const alertColor = getChangeColor([...resourceChange.change.actions]);

  return <Row>
    <Col>
      <Row>
        <Col>
          <Alert color={alertColor}>
            <div onClick={toggleDetails}>
              <Row>
                <Col>
                  <h4>{getChangeLabel([...resourceChange.change.actions])}</h4>
                </Col>
              </Row>
              <dl>
                <Row>
                  <Col>
                    <dt>Address:</dt>
                    <dd>{resourceChange.address}</dd>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <dt>Type:</dt>
                    <dd>{resourceChange.type}</dd>
                  </Col>
                </Row>
              </dl>
            </div>

            <Row>
              <Col>
                <Collapse isOpen={showDetails}>
                  {Object.entries(changeMap).map(([key, change], ix) => {
                    if (!change.changed) {
                      return null;
                    }
                    return <ChangeRow key={ix} {...change} />;
                  })}
                </Collapse>
              </Col>
            </Row>
          </Alert>
        </Col>
      </Row>
    </Col>
  </Row>;
};
