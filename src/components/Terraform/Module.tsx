import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Terraform } from '../../terraform';
import { Resource } from './Resource';

export type ModuleProps = {
  module: Terraform.RootModule;
};

export const Module: React.FunctionComponent<ModuleProps> = (props) => {
  const { module } = props;

  if (module === undefined) {
    return null;
  }

  const resources = module.resources.map((resource, ix) => {
    return <Resource key={ix} values={resource} />
  });

  const childModules = module.child_modules.map((module, ix) => {
    return <Module key={ix} module={module} />;
  });

  return <Container>
    <Row>
      <Col>
        <Row>
          <Col>
            Resources
          </Col>
        </Row>
        <Row>
          <Col>
            {resources}
          </Col>
        </Row>
      </Col>
    </Row>
    <Row>
      <Col>
        <Row>
          <Col>
            Child Modules
          </Col>
        </Row>
        <Row>
          <Col>
            {childModules}
          </Col>
        </Row>
      </Col>
    </Row>
  </Container>;
};
