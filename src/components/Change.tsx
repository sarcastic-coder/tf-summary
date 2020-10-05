import React from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { Terraform } from '../terraform';

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
};

const findChange = (a: unknown, b: unknown): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return JSON.stringify(a) !== JSON.stringify(b);
  }

  if (typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a) !== JSON.stringify(b);
  }

  return a !== b;
};

const formatValue = (value: string | boolean | null | any[] | Record<string, any>) => {
  switch (typeof value) {
    case 'string':
      return value;
    default:
      return JSON.stringify(value, null, 2);
  }
};

const ChangeRow: React.FunctionComponent<ChangeMapValue> = (props: ChangeMapValue) => {
  const { address, before, after, changed, after_unknown } = props;

  const normalisedAddress = address.replace(/_/gu, ' ');

  if (!changed) {
    return <Row>
      <Col>
        <h5>{normalisedAddress}</h5>
      </Col>
      <Col>
        No Change
      </Col>
    </Row>;
  }

  return <Row className={"mt-2"}>
    <Col>
      <Row>
        <Col>
          <h5>{normalisedAddress} (<code>{address}</code>)</h5>
        </Col>
      </Row>
      <Row noGutters={true}>
        <Col xs={12} md={6}>
          <pre className={'p-2 m-0 bg-light'}>{formatValue(before)}</pre>
        </Col>
        <Col xs={12} md={"auto"} className={"d-flex align-items-center text-center"}>
          <svg width="1em" height="1em" viewBox="0 0 16 16" className="d-none d-md-block" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>

          <svg width="1em" height="1em" viewBox="0 0 16 16" className="d-md-none mx-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
          </svg>
        </Col>
        <Col xs={12} md>
          {after_unknown
            ? <p className={"m-0 p-2"}>
              <em>Known after apply</em>
            </p>
            : (<pre className={'p-2 m-0 bg-light'}>{formatValue(after)}</pre>)
          }
        </Col>
      </Row>
    </Col>
  </Row>;
};

type ChangeProps = {
  resourceChange: Terraform.ResourceChange;
};

export const Change: React.FunctionComponent<ChangeProps> = (props) => {
  const { resourceChange } = props;
  const [showDetails, setShowDetails] = React.useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const changeMap: ChangeMap = Object.entries(resourceChange.change.before ?? {})
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

  const changes = Object.values(changeMap).filter((change) => {
    return change.changed;
  });

  const alertColor = getChangeColor([...resourceChange.change.actions]);

  return <Row className={"mb-2"}>
    <Col>
      <Card outline color={alertColor}>
        <CardHeader className={`bg-${alertColor}`}>
          {getChangeLabel([...resourceChange.change.actions])}
        </CardHeader>
        <CardBody>
          <Row tag={'dl'}>
            <Col md={4}>
              <dt>Type:</dt>
              <dd>{resourceChange.type}</dd>
            </Col>
            <Col md={8}>
              <dt>Address:</dt>
              <dd>{resourceChange.address}</dd>
            </Col>
          </Row>
          {changes.length > 0 && <Row>
            <Col className={'d-flex align-items-center'}>
              <Button onClick={toggleDetails} color={alertColor}>
                {showDetails
                  ? <span className={'mr-1'}>Hide Changes</span>
                  : <span className={'mr-1'}>Show Changes</span>}
                <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{transition: '0.5s ease', transform: showDetails ? 'rotate(90deg)' : undefined}}>
                  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </Button>
            </Col>
          </Row>}

          <Row className={'mt-3'}>
            <Col>
              <Collapse isOpen={showDetails}>
                <Row>
                  <Col>
                    <h4>Changes</h4>
                  </Col>
                </Row>
                {changes.map((change, ix) => {
                  if (!change.changed) {
                    return null;
                  }
                  return <React.Fragment key={ix}>
                    <hr className={"d-md-none"} />
                    <ChangeRow key={ix} {...change} />
                  </React.Fragment>;
                })}
              </Collapse>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  </Row>;
};
