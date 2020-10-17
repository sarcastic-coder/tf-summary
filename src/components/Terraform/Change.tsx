import React from 'react';
import { Button, Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { Terraform } from '../../terraform';

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

const getChangeHeader = (actions: string[]) => {
  if (actions.length === 1) {
    const action = actions.shift();

    switch (action) {
      case 'no-op':
        return <>
          <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi mr-1 bi-dash-square text-gray" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
          </svg>
          <span>No change</span>
        </>;
      case 'update':
        return <>
          <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi mr-1 bi-exclamation-square text-warning" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
          </svg>
          <span>Update in place</span>
        </>;
      case 'delete':
        return <>
          <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi mr-1 bi-x-square text-danger" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>
          <span>Delete</span>
        </>;
      case 'create':
        return <>
          <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi mr-1 bi-plus-square text-success" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          <span>Create</span>
        </>
      case 'read':
        return <>
          <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi mr-1 bi-info-square text-info" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
            <circle cx="8" cy="4.5" r="1"/>
          </svg>
          <span>Read</span>
        </>
      default:
        return action;
    }
  }

  if (actions === ['create', 'delete']) {
    return <>
      <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi mr-1 bi-plus-square text-success" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
        <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
      </svg>
      <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi mr-1 bi-x-square text-danger" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
        <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
      </svg>
      <span>Create new before delete old</span>
    </>;
  }

  if (actions === ['delete', 'create']) {
    return <>
      <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi mr-1 bi-x-square text-danger" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
        <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
      </svg>
      <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi mr-1 bi-plus-square text-success" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
        <path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
      </svg>
      <span>Delete old before create new</span>
    </>;
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
          <pre className={'change-value p-2 m-0'}>{formatValue(before)}</pre>
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
            : (<pre className={'change-value p-2 m-0'}>{formatValue(after)}</pre>)
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
        <CardHeader className={"d-flex align-items-center"}>
          {getChangeHeader([...resourceChange.change.actions])}
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
              <Button onClick={toggleDetails} color={"primary"}>
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
