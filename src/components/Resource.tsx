import React from 'react';
import { Col, Row } from 'reactstrap';

export type ResourceRepresentation = {
  address: string;
  mode: 'managed' | 'data';
  type: string;
  name: string;
  index: number;
  provider_name: string;
  schema_version: number;
  values: Record<string, any>;
};

export type ResourceProps = {
  values: ResourceRepresentation['values'];
};

export const Resource: React.FunctionComponent<ResourceProps> = (props) => {
  const { values } = props;

  return <Row>
    <Col>
      {/*<Row>*/}
      {/*  <Col>*/}
      {/*    Address:*/}
      {/*  </Col>*/}
      {/*  <Col>*/}
      {/*    {representation.address}*/}
      {/*  </Col>*/}
      {/*</Row>*/}
      {/*<Row>*/}
      {/*  <Col>*/}
      {/*    Type:*/}
      {/*  </Col>*/}
      {/*  <Col>*/}
      {/*    {representation.type}*/}
      {/*  </Col>*/}
      {/*</Row>*/}
      <Row>
        <Col>
          Properties:
        </Col>
        <Col>
          {JSON.stringify(values)}
        </Col>
      </Row>
    </Col>
  </Row>;
};
