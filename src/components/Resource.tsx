import React from 'react';
import { Col, Row } from 'reactstrap';
import { Terraform } from '../terraform';

export type ResourceProps = {
  values: Terraform.Resource['values'];
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
